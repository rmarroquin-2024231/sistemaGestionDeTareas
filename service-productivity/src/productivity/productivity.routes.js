'use strict';

import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
    dashboard,
    pendingTasks,
    overdueTasks,
    prioritySummary,
    completionStatistics
} from './productivity.controller.js';

const router = Router();

router.get('/dashboard', validateJWT, dashboard);
router.get('/tasks/pending', validateJWT, pendingTasks);
router.get('/tasks/overdue', validateJWT, overdueTasks);
router.get('/summary/priorities', validateJWT, prioritySummary);
router.get('/statistics/completion', validateJWT, completionStatistics);

export default router;
