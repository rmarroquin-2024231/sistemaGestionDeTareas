'use strict';

import {
    createTaskRecord,
    getTasksByUser,
    getTaskById,
    searchTasks,
    updateTaskRecord,
    deleteTaskRecord,
    changeTaskStatus,
    changeTaskPriority,
    changeTaskDueDate
} from './task.service.js';

// Registrar una nueva tarea asociada al usuario autenticado
export const createTask = async (req, res) => {
    try {
        const task = await createTaskRecord({
            taskData: {
                ...req.body,
                userId: req.user.id
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tarea registrada exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al registrar la tarea.',
            error: err.message
        });
    }
};

// Consultar todas las tareas del usuario autenticado
export const getMyTasks = async (req, res, next) => {
    try {
        const tasks = await getTasksByUser(req.user.id);

        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (err) {
        next(err);
    }
};

// Consultar una tarea específica del usuario autenticado
export const getTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await getTaskById(id, req.user.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada o no pertenece al usuario',
                error: 'TASK_NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// Buscar tareas del usuario autenticado por título, estado o prioridad
export const searchMyTasks = async (req, res, next) => {
    try {
        const { title, status, priority } = req.query;

        const tasks = await searchTasks(req.user.id, { title, status, priority });

        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (err) {
        next(err);
    }
};

// Editar una tarea existente
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await updateTaskRecord(id, req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Tarea actualizada exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la tarea.',
            error: err.message
        });
    }
};

// Eliminar una tarea existente
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await deleteTaskRecord(id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Tarea eliminada exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar la tarea.',
            error: err.message
        });
    }
};

// Cambiar el estado de una tarea (PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA)
export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await changeTaskStatus(id, req.user.id, status);

        res.status(200).json({
            success: true,
            message: 'Estado de la tarea actualizado exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al cambiar el estado de la tarea.',
            error: err.message
        });
    }
};

// Cambiar la prioridad de una tarea (BAJA, MEDIA, ALTA)
export const changePriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        const task = await changeTaskPriority(id, req.user.id, priority);

        res.status(200).json({
            success: true,
            message: 'Prioridad de la tarea actualizada exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al cambiar la prioridad de la tarea.',
            error: err.message
        });
    }
};

// Cambiar la fecha límite de una tarea
export const changeDueDate = async (req, res) => {
    try {
        const { id } = req.params;
        const { dueDate } = req.body;

        const task = await changeTaskDueDate(id, req.user.id, dueDate);

        res.status(200).json({
            success: true,
            message: 'Fecha límite de la tarea actualizada exitosamente.',
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error al cambiar la fecha límite de la tarea.',
            error: err.message
        });
    }
};
