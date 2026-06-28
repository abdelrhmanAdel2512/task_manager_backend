'use strict';

const Task = require('../models/task.model');
const Project = require('../models/project.model');
const { syncProjectCounts } = require('./projects.service');
const ApiError = require('../utils/ApiError');

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * Verifies the project exists and is owned by the requesting user.
 * Returns the project so callers can use it without a second DB hit.
 */
const verifyProjectOwnership = async (projectId, ownerId) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project');
  if (project.owner.toString() !== ownerId.toString()) throw ApiError.forbidden();
  return project;
};

/**
 * Verifies the task exists and belongs to the given project (and thus owner).
 */
const findTaskOrFail = async (taskId, projectId, ownerId) => {
  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) throw ApiError.notFound('Task');
  if (task.owner.toString() !== ownerId.toString()) throw ApiError.forbidden();
  return task;
};

// ── Service methods ───────────────────────────────────────────────────────────

const listTasks = async ({ projectId, ownerId, status, priority, page = 1, limit = 50 }) => {
  await verifyProjectOwnership(projectId, ownerId);

  const filter = { project: projectId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    data: tasks,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const getTask = async ({ taskId, projectId, ownerId }) => {
  await verifyProjectOwnership(projectId, ownerId);
  return findTaskOrFail(taskId, projectId, ownerId);
};

const createTask = async ({ projectId, ownerId, title, description, status, priority, deadline }) => {
  await verifyProjectOwnership(projectId, ownerId);

  const task = await Task.create({
    project: projectId,
    owner: ownerId,
    title,
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    deadline: deadline || null,
  });

  // Keep parent project counters accurate
  await syncProjectCounts(projectId);

  return task;
};

const updateTask = async ({ taskId, projectId, ownerId, updates }) => {
  await verifyProjectOwnership(projectId, ownerId);
  const task = await findTaskOrFail(taskId, projectId, ownerId);

  const allowedFields = ['title', 'description', 'status', 'priority', 'deadline'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      task[field] = updates[field];
    }
  });

  await task.save();
  await syncProjectCounts(projectId);

  return task;
};

const changeTaskStatus = async ({ taskId, projectId, ownerId, status }) => {
  await verifyProjectOwnership(projectId, ownerId);
  const task = await findTaskOrFail(taskId, projectId, ownerId);

  task.status = status;
  await task.save();
  await syncProjectCounts(projectId);

  return task;
};

const deleteTask = async ({ taskId, projectId, ownerId }) => {
  await verifyProjectOwnership(projectId, ownerId);
  const task = await findTaskOrFail(taskId, projectId, ownerId);

  await task.deleteOne();
  await syncProjectCounts(projectId);
};

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  changeTaskStatus,
  deleteTask,
};
