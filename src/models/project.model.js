'use strict';

const mongoose = require('mongoose');

const PROJECT_STATUSES = ['active', 'on_hold', 'completed'];

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: PROJECT_STATUSES, message: '{VALUE} is not a valid project status' },
      default: 'active',
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      match: [/^0xFF[0-9A-Fa-f]{6}$/, 'Color must be in format 0xFFRRGGBB'],
      default: '0xFF6366f1',
    },
    stack: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10 && arr.every((s) => s.length <= 30),
        message: 'Stack can have at most 10 items, each max 30 characters',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Denormalized counters — kept in sync by the task service
    taskCount: { type: Number, default: 0, min: 0 },
    doneCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Virtual: progress percentage ──────────────────────────────────────────────
projectSchema.virtual('progressPct').get(function () {
  if (this.taskCount === 0) return 0;
  return Math.round((this.doneCount / this.taskCount) * 100);
});

// ── Index: owner + status for dashboard queries ───────────────────────────────
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ owner: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
module.exports.PROJECT_STATUSES = PROJECT_STATUSES;
