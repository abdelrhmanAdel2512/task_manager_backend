'use strict';

const Project = require('../models/project.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const stats = await Project.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          projectsCount: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          totalTasks: { $sum: '$taskCount' },
          doneTasks: { $sum: '$doneCount' },
        },
      },
    ]);

    let data = {
      projectsCount: 0,
      activeCount: 0,
      totalTasks: 0,
      doneTasks: 0,
      completePct: 0,
    };

    if (stats.length > 0) {
      const s = stats[0];
      data.projectsCount = s.projectsCount;
      data.activeCount = s.activeCount;
      data.totalTasks = s.totalTasks;
      data.doneTasks = s.doneTasks;
      data.completePct =
        s.totalTasks === 0 ? 0 : Math.round((s.doneTasks / s.totalTasks) * 100);
    }

    ApiResponse.ok(res, data, 'Stats retrieved successfully');
});
