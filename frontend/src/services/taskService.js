import { tasksClient } from '../api/axiosClient.js';

/**
 * Contrato del microservicio service-tasks (base: /tasks/v1/tasks):
 *   POST   /                  crear tarea
 *   GET    /                  listar tareas del usuario autenticado
 *   GET    /search             buscar por title/status/priority (query params)
 *   GET    /:id                 obtener una tarea puntual
 *   PUT    /:id                 editar una tarea
 *   DELETE /:id                 eliminar una tarea
 *   PATCH  /:id/status           cambiar estado
 *   PATCH  /:id/priority          cambiar prioridad
 *   PATCH  /:id/due-date           cambiar fecha límite
 */

const BASE = '/tasks/v1/tasks';

const extractErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join('. ');
  }
  return data?.message || data?.error || fallback;
};

export const listTasks = async () => {
  try {
    const { data } = await tasksClient.get(BASE);
    return data.data || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudieron cargar las tareas.'));
  }
};

export const searchTasks = async ({ title, status, priority } = {}) => {
  try {
    const params = {};
    if (title) params.title = title;
    if (status) params.status = status;
    if (priority) params.priority = priority;

    const { data } = await tasksClient.get(`${BASE}/search`, { params });
    return data.data || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo completar la búsqueda.'));
  }
};

export const getTask = async (id) => {
  try {
    const { data } = await tasksClient.get(`${BASE}/${id}`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cargar la tarea.'));
  }
};

export const createTask = async (payload) => {
  try {
    const { data } = await tasksClient.post(BASE, payload);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo crear la tarea.'));
  }
};

export const updateTask = async (id, payload) => {
  try {
    const { data } = await tasksClient.put(`${BASE}/${id}`, payload);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo actualizar la tarea.'));
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await tasksClient.delete(`${BASE}/${id}`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo eliminar la tarea.'));
  }
};

export const setTaskStatus = async (id, status) => {
  try {
    const { data } = await tasksClient.patch(`${BASE}/${id}/status`, { status });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cambiar el estado.'));
  }
};

export const setTaskPriority = async (id, priority) => {
  try {
    const { data } = await tasksClient.patch(`${BASE}/${id}/priority`, { priority });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cambiar la prioridad.'));
  }
};

export const setTaskDueDate = async (id, dueDate) => {
  try {
    const { data } = await tasksClient.patch(`${BASE}/${id}/due-date`, { dueDate });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cambiar la fecha límite.'));
  }
};

export const TASK_STATUSES = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];
export const TASK_PRIORITIES = ['BAJA', 'MEDIA', 'ALTA'];
