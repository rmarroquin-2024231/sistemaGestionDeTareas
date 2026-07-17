'use strict';

import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es requerido'],
            trim: true,
            maxLength: [100, 'El título no puede exceder los 100 caracteres.']
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'La descripción no puede exceder los 500 caracteres.'],
            default: ''
        },
        priority: {
            type: String,
            required: [true, 'La prioridad es requerida.'],
            enum: {
                values: ['BAJA', 'MEDIA', 'ALTA'],
                message: 'Prioridad no válida.',
            },
            default: 'MEDIA'
        },
        status: {
            type: String,
            enum: {
                values: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'],
                message: 'Estado no válido.'
            },
            default: 'PENDIENTE'
        },
        dueDate: {
            type: Date,
            default: null
        },
        userId: {
            type: String,
            required: [true, 'El usuario es requerido'],
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices para optimizar búsquedas
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ title: 'text' });

export default model('Task', taskSchema);
