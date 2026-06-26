'use strict';

const Project = require('../models/project.model');
const Task = require('../models/task.model');
const ApiError = require('../utils/ApiError');

// ── Guards ────────────────────────────────────────────────────────────────────

const findProjectOrFail = async (projectId, ownerId) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project');
  if (project.owner.toString() !== ownerId.toString()) throw ApiError.forbidden();
  return project;
};

// ── Service methods ───────────────────────────────────────────────────────────

const listProjects = async ({ ownerId, status, page = 1, limit = 20 }) => {
  const filter = { owner: ownerId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const getProject = async ({ projectId, ownerId }) =>
  findProjectOrFail(projectId, ownerId);

const createProject = async ({ ownerId, name, description, status, color, stack }) => {
  const project = await Project.create({
    owner: ownerId,
    name,
    description: description || '',
    status: status || 'active',
    color,
    stack: stack || [],
  });
  return project;
};

const updateProject = async ({ projectId, ownerId, updates }) => {
  const project = await findProjectOrFail(projectId, ownerId);

  const allowedFields = ['name', 'description', 'status', 'color', 'stack'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      project[field] = updates[field];
    }
  });

  await project.save();
  return project;
};

const deleteProject = async ({ projectId, ownerId }) => {
  const project = await findProjectOrFail(projectId, ownerId);

  // Cascade delete all tasks belonging to this project
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
};

/**
 * Recomputes taskCount and doneCount on the parent project.
 * Called by the task service after any task mutation.
 */
const syncProjectCounts = async (projectId) => {
  const [taskCount, doneCount] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: 'done' }),
  ]);

  await Project.findByIdAndUpdate(projectId, { taskCount, doneCount });
};

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  syncProjectCounts,
};
