'use strict';

import { fetchUserTasks } from './tasks.client.js';

const STATUS = {
    COMPLETADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA'
};

const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA'];

const isPending = (task) =>
    task.status !== STATUS.COMPLETADA && task.status !== STATUS.CANCELADA;

const isOverdue = (task) => {
    if (!task.dueDate || !isPending(task)) return false;
    return new Date(task.dueDate) < new Date();
};

const buildPriorityDistribution = (tasks) => {
    const distribution = PRIORITIES.reduce((acc, priority) => {
        acc[priority] = 0;
        return acc;
    }, {});

    tasks.forEach((task) => {
        if (distribution[task.priority] !== undefined) {
            distribution[task.priority] += 1;
        }
    });

    return distribution;
};

const calculatePercentage = (completed, total) =>
    total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2));

export const getCompletionStats = async (token) => {
    const tasks = await fetchUserTasks(token);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === STATUS.COMPLETADA).length;

    return {
        total,
        completed,
        percentage: calculatePercentage(completed, total)
    };
};

export const getPendingTasks = async (token) => {
    const tasks = await fetchUserTasks(token);
    return tasks.filter(isPending);
};

export const getOverdueTasks = async (token) => {
    const tasks = await fetchUserTasks(token);
    return tasks.filter(isOverdue);
};

export const getPrioritySummary = async (token) => {
    const tasks = await fetchUserTasks(token);
    return buildPriorityDistribution(tasks);
};

export const getDashboard = async (token) => {
    const tasks = await fetchUserTasks(token);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === STATUS.COMPLETADA).length;
    const pending = tasks.filter(isPending);
    const overdue = tasks.filter(isOverdue);

    return {
        totalTasks: total,
        completedTasks: completed,
        completionPercentage: calculatePercentage(completed, total),
        pendingTasks: pending.length,
        overdueTasks: overdue.length,
        priorityDistribution: buildPriorityDistribution(tasks)
    };
};
