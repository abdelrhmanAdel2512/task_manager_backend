'use strict';

const projectsService = require('../services/projects.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listProjects = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await projectsService.listProjects({
    ownerId: req.user._id,
    status,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 20,
  });
  ApiResponse.ok(res, result);
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectsService.getProject({
    projectId: req.params.id,
    ownerId: req.user._id,
  });
  ApiResponse.ok(res, project);
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, color, stack } = req.body;
  const project = await projectsService.createProject({
    ownerId: req.user._id,
    name, description, status, color, stack,
  });
  ApiResponse.created(res, project, 'Project created successfully');
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectsService.updateProject({
    projectId: req.params.id,
    ownerId: req.user._id,
    updates: req.body,
  });
  ApiResponse.ok(res, project, 'Project updated successfully');
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectsService.deleteProject({
    projectId: req.params.id,
    ownerId: req.user._id,
  });
  ApiResponse.noContent(res);
});

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject };
