'use strict';

const mongoose = require('mongoose');

const TASK_STATUSES = ['pending', 'in_progress', 'done', 'cancelled'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: TASK_STATUSES, message: '{VALUE} is not a valid task status' },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: { values: TASK_PRIORITIES, message: '{VALUE} is not a valid priority' },
      default: 'medium',
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id;
        if (ret.project && typeof ret.project === 'object' && ret.project._id) {
          ret.project_id = ret.project._id;
          ret.project_name = ret.project.name;
          ret.project_color = ret.project.color;
        } else {
          ret.project_id = ret.project;
        }
        delete ret._id;
        delete ret.__v;
        delete ret.project;
        delete ret.owner;
        return ret;
      },
    },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────────────────
taskSchema.virtual('is_overdue').get(function () {
  if (!this.deadline) return false;
  if (this.status === 'done' || this.status === 'cancelled') return false;
  return new Date() > this.deadline;
});

// ── Compound indexes for filtered task listing ────────────────────────────────
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, priority: 1 });
taskSchema.index({ project: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
