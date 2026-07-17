import { body, param, query } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA'];
const STATUSES = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

// Validaciones para crear una tarea
export const validateCreateTask = [
    validateJWT,

    body('title')
        .notEmpty()
        .withMessage('El título es requerido.')
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres.'),

    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder los 500 caracteres.'),

    body('priority')
        .optional()
        .isIn(PRIORITIES)
        .withMessage(`Prioridad no válida. Use: ${PRIORITIES.join(', ')}`),

    body('status')
        .optional()
        .isIn(STATUSES)
        .withMessage(`Estado no válido. Use: ${STATUSES.join(', ')}`),

    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La fecha límite debe ser una fecha válida (ISO8601).'),

    checkValidators,
];

// Validaciones para editar una tarea
export const validateUpdateTask = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la tarea no es válido.'),

    body('title')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres.'),

    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder los 500 caracteres.'),

    body('priority')
        .optional()
        .isIn(PRIORITIES)
        .withMessage(`Prioridad no válida. Use: ${PRIORITIES.join(', ')}`),

    body('status')
        .optional()
        .isIn(STATUSES)
        .withMessage(`Estado no válido. Use: ${STATUSES.join(', ')}`),

    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('La fecha límite debe ser una fecha válida (ISO8601).'),

    checkValidators,
];

// Validación de un ID de tarea en los parámetros de la ruta
export const validateTaskId = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la tarea no es válido.'),

    checkValidators,
];

// Validación para cambiar el estado de una tarea
export const validateChangeStatus = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la tarea no es válido.'),

    body('status')
        .notEmpty()
        .withMessage('El nuevo estado es requerido.')
        .isIn(STATUSES)
        .withMessage(`Estado no válido. Use: ${STATUSES.join(', ')}`),

    checkValidators,
];

// Validación para cambiar la prioridad de una tarea
export const validateChangePriority = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la tarea no es válido.'),

    body('priority')
        .notEmpty()
        .withMessage('La nueva prioridad es requerida.')
        .isIn(PRIORITIES)
        .withMessage(`Prioridad no válida. Use: ${PRIORITIES.join(', ')}`),

    checkValidators,
];

// Validación para cambiar la fecha límite de una tarea
export const validateChangeDueDate = [
    validateJWT,

    param('id')
        .isMongoId()
        .withMessage('El ID de la tarea no es válido.'),

    body('dueDate')
        .notEmpty()
        .withMessage('La nueva fecha límite es requerida.')
        .isISO8601()
        .withMessage('La fecha límite debe ser una fecha válida (ISO8601).'),

    checkValidators,
];

// Validación de los query params para consultar/buscar tareas
export const validateSearchTasks = [
    validateJWT,

    query('title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('El título de búsqueda no es válido.'),

    query('status')
        .optional()
        .isIn(STATUSES)
        .withMessage(`Estado no válido. Use: ${STATUSES.join(', ')}`),

    query('priority')
        .optional()
        .isIn(PRIORITIES)
        .withMessage(`Prioridad no válida. Use: ${PRIORITIES.join(', ')}`),

    checkValidators,
];
