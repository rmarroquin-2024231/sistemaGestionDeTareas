'use strict';

import {
    getCompletionStats,
    getPendingTasks,
    getOverdueTasks,
    getPrioritySummary,
    getDashboard
} from './productivity.service.js';

export const dashboard = async (req, res, next) => {
    try {
        const data = await getDashboard(req.token);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const pendingTasks = async (req, res, next) => {
    try {
        const data = await getPendingTasks(req.token);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const overdueTasks = async (req, res, next) => {
    try {
        const data = await getOverdueTasks(req.token);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const prioritySummary = async (req, res, next) => {
    try {
        const data = await getPrioritySummary(req.token);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const completionStatistics = async (req, res, next) => {
    try {
        const data = await getCompletionStats(req.token);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
