'use strict';

const tasksService = require('../services/tasks.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, page, limit } = req.query;
  const result = await tasksService.listTasks({
    projectId: req.params.projectId,
    ownerId: req.user._id,
    status,
    priority,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 50,
  });
  ApiResponse.ok(res, result);
});

const listAllTasks = asyncHandler(async (req, res) => {
  const { status, priority, page, limit } = req.query;
  const result = await tasksService.listAllTasks({
    ownerId: req.user._id,
    status,
    priority,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 50,
  });
  ApiResponse.ok(res, result);
});

const getTask = asyncHandler(async (req, res) => {
  const task = await tasksService.getTask({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    ownerId: req.user._id,
  });
  ApiResponse.ok(res, task);
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;
  const task = await tasksService.createTask({
    projectId: req.params.projectId,
    ownerId: req.user._id,
    title, description, status, priority, deadline,
  });
  ApiResponse.created(res, task, 'Task created successfully');
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTask({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    ownerId: req.user._id,
    updates: req.body,
  });
  ApiResponse.ok(res, task, 'Task updated successfully');
});

const changeTaskStatus = asyncHandler(async (req, res) => {
  const task = await tasksService.changeTaskStatus({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    ownerId: req.user._id,
    status: req.body.status,
  });
  ApiResponse.ok(res, task, 'Task status updated');
});

const deleteTask = asyncHandler(async (req, res) => {
  await tasksService.deleteTask({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    ownerId: req.user._id,
  });
  ApiResponse.noContent(res);
});

module.exports = { listTasks, listAllTasks, getTask, createTask, updateTask, changeTaskStatus, deleteTask };
