'use strict';

const TASKS_BASE_PATH = '/tasks/v1/tasks';

// Consulta las tareas del usuario autenticado en el Task Service,
// propagando el mismo JWT recibido en la petición original.
export const fetchUserTasks = async (token) => {
    const tasksServiceUrl = process.env.TASKS_SERVICE_URL;

    if (!tasksServiceUrl) {
        const error = new Error('Configuración del servidor inválida: falta TASKS_SERVICE_URL');
        error.statusCode = 500;
        error.code = 'MISSING_TASKS_SERVICE_URL';
        throw error;
    }

    let response;

    try {
        response = await fetch(`${tasksServiceUrl}${TASKS_BASE_PATH}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        const error = new Error('No se pudo conectar con el Task Service.');
        error.statusCode = 502;
        error.code = 'TASKS_SERVICE_UNREACHABLE';
        throw error;
    }

    if (response.status === 401) {
        const error = new Error('Token inválido o expirado al consultar el Task Service.');
        error.statusCode = 401;
        error.code = 'INVALID_TOKEN';
        throw error;
    }

    if (!response.ok) {
        const error = new Error('El Task Service respondió con un error al consultar las tareas.');
        error.statusCode = 502;
        error.code = 'TASKS_SERVICE_ERROR';
        throw error;
    }

    const body = await response.json();
    return body.data || [];
};
