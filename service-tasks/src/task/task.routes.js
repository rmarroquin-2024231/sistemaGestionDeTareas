'use strict';

import { Router } from 'express';
import {
    createTask,
    getMyTasks,
    getTask,
    searchMyTasks,
    updateTask,
    deleteTask,
    changeStatus,
    changePriority,
    changeDueDate
} from './task.controller.js';
import {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId,
    validateChangeStatus,
    validateChangePriority,
    validateChangeDueDate,
    validateSearchTasks
} from '../../middlewares/task-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post(
    '/',
    validateCreateTask,
    createTask
);

router.get(
    '/',
    validateJWT,
    getMyTasks
);

router.get(
    '/search',
    validateSearchTasks,
    searchMyTasks
);

router.get(
    '/:id',
    validateTaskId,
    getTask
);

router.put(
    '/:id',
    validateUpdateTask,
    updateTask
);

router.delete(
    '/:id',
    validateTaskId,
    deleteTask
);

router.patch(
    '/:id/status',
    validateChangeStatus,
    changeStatus
);

router.patch(
    '/:id/priority',
    validateChangePriority,
    changePriority
);

router.patch(
    '/:id/due-date',
    validateChangeDueDate,
    changeDueDate
);

export default router;
