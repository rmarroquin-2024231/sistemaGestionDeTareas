'use strict';

import Task from './task.model.js';

// Crear una nueva tarea
export const createTaskRecord = async ({ taskData }) => {
    const task = new Task(taskData);
    await task.save();

    return task;
};

// Obtener todas las tareas del usuario autenticado
export const getTasksByUser = async (userId) => {
    return await Task.find({ userId }).sort({ createdAt: -1 });
};

// Obtener una tarea puntual del usuario autenticado
export const getTaskById = async (id, userId) => {
    return await Task.findOne({ _id: id, userId });
};

// Buscar tareas del usuario por título, estado o prioridad
export const searchTasks = async (userId, { title, status, priority }) => {
    const filters = { userId };

    if (title) {
        filters.title = { $regex: title, $options: 'i' };
    }

    if (status) {
        filters.status = status;
    }

    if (priority) {
        filters.priority = priority;
    }

    return await Task.find(filters).sort({ createdAt: -1 });
};

// Editar una tarea existente
export const updateTaskRecord = async (id, userId, changes) => {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
        throw new Error('Tarea no encontrada');
    }

    Object.assign(task, changes);
    await task.save();

    return task;
};

// Eliminar una tarea existente
export const deleteTaskRecord = async (id, userId) => {
    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
        throw new Error('Tarea no encontrada');
    }

    return task;
};

// Cambiar el estado de una tarea
export const changeTaskStatus = async (id, userId, status) => {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
        throw new Error('Tarea no encontrada');
    }

    if (task.status === status) {
        throw new Error(`La tarea ya se encuentra en el estado ${status}`);
    }

    task.status = status;
    await task.save();

    return task;
};

// Cambiar la prioridad de una tarea
export const changeTaskPriority = async (id, userId, priority) => {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
        throw new Error('Tarea no encontrada');
    }

    if (task.priority === priority) {
        throw new Error(`La tarea ya tiene la prioridad ${priority}`);
    }

    task.priority = priority;
    await task.save();

    return task;
};

// Cambiar la fecha límite de una tarea
export const changeTaskDueDate = async (id, userId, dueDate) => {
    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
        throw new Error('Tarea no encontrada');
    }

    task.dueDate = dueDate;
    await task.save();

    return task;
};
