import { useState } from 'react';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../services/taskService.js';

const STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
};

const PRIORITY_LABELS = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' };

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const TaskForm = ({ initialTask, onSubmit, onCancel, isSaving }) => {
  const [form, setForm] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'MEDIA',
    status: initialTask?.status || 'PENDIENTE',
    dueDate: toDateInputValue(initialTask?.dueDate)
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.title || form.title.trim().length < 3) {
      next.title = 'El título debe tener al menos 3 caracteres.';
    }
    if (form.description && form.description.length > 500) {
      next.description = 'Máximo 500 caracteres.';
    }
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="db-field">
        <label className="db-field__label" htmlFor="task-title">
          Título
        </label>
        <input
          id="task-title"
          className="db-input"
          value={form.title}
          onChange={handleChange('title')}
          placeholder="Ej. Preparar reporte semanal"
        />
        {errors.title && <span className="db-field__error">{errors.title}</span>}
      </div>

      <div className="db-field">
        <label className="db-field__label" htmlFor="task-description">
          Descripción
        </label>
        <textarea
          id="task-description"
          className="db-textarea"
          value={form.description}
          onChange={handleChange('description')}
          placeholder="Detalles opcionales de la tarea"
        />
        {errors.description && <span className="db-field__error">{errors.description}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="db-field">
          <label className="db-field__label" htmlFor="task-priority">
            Prioridad
          </label>
          <select
            id="task-priority"
            className="db-select"
            value={form.priority}
            onChange={handleChange('priority')}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>

        <div className="db-field">
          <label className="db-field__label" htmlFor="task-status">
            Estado
          </label>
          <select id="task-status" className="db-select" value={form.status} onChange={handleChange('status')}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="db-field">
        <label className="db-field__label" htmlFor="task-due-date">
          Fecha límite
        </label>
        <input
          id="task-due-date"
          type="date"
          className="db-input"
          value={form.dueDate}
          onChange={handleChange('dueDate')}
        />
      </div>

      <div className="db-form__actions">
        <button type="button" className="db-btn db-btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="db-btn db-btn--primary" disabled={isSaving}>
          {isSaving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
