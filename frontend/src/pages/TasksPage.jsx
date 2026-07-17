import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listTasks,
  searchTasks,
  createTask,
  updateTask,
  deleteTask,
  setTaskStatus,
  setTaskPriority,
  TASK_STATUSES,
  TASK_PRIORITIES
} from '../services/taskService.js';
import Modal from '../components/dashboard/Modal.jsx';
import TaskForm from '../components/dashboard/TaskForm.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import './TasksPage.css';

const STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
};

const PRIORITY_LABELS = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' };
const PRIORITY_WEIGHT = { ALTA: 0, MEDIA: 1, BAJA: 2 };

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'dueDate', label: 'Fecha límite' },
  { value: 'priority', label: 'Prioridad' },
  { value: 'title', label: 'Título (A-Z)' }
];

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isOverdue = (task) => {
  if (!task.dueDate) return false;
  if (task.status === 'COMPLETADA' || task.status === 'CANCELADA') return false;
  return new Date(task.dueDate) < new Date();
};

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [formError, setFormError] = useState('');

  const [filters, setFilters] = useState({ title: '', status: '', priority: '' });
  const [sortBy, setSortBy] = useState('recent');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = useCallback(async (activeFilters) => {
    setIsLoading(true);
    setError('');
    try {
      const hasFilters = activeFilters.title || activeFilters.status || activeFilters.priority;
      const result = hasFilters ? await searchTasks(activeFilters) : await listTasks();
      setTasks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchTasks(filters);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const clearFilters = () => {
    const empty = { title: '', status: '', priority: '' };
    setFilters(empty);
    fetchTasks(empty);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingTask(null);
    setFormError('');
  };

  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    setFormError('');
    try {
      if (editingTask) {
        await updateTask(editingTask._id, payload);
      } else {
        await createTask(payload);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      await fetchTasks(filters);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeletingId(task._id);
    setActionError('');
    try {
      await deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (task, status) => {
    setActionError('');
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status } : t)));
    try {
      await setTaskStatus(task._id, status);
    } catch (err) {
      setTasks(previous);
      setActionError(err.message);
    }
  };

  const handlePriorityChange = async (task, priority) => {
    setActionError('');
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, priority } : t)));
    try {
      await setTaskPriority(task._id, priority);
    } catch (err) {
      setTasks(previous);
      setActionError(err.message);
    }
  };

  const sortedTasks = useMemo(() => {
    const list = [...tasks];
    if (sortBy === 'dueDate') {
      list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'priority') {
      list.sort((a, b) => (PRIORITY_WEIGHT[a.priority] ?? 3) - (PRIORITY_WEIGHT[b.priority] ?? 3));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    }
    return list;
  }, [tasks, sortBy]);

  const summary = useMemo(() => {
    const active = tasks.filter((t) => t.status === 'PENDIENTE' || t.status === 'EN_PROGRESO').length;
    const completed = tasks.filter((t) => t.status === 'COMPLETADA').length;
    const overdue = tasks.filter(isOverdue).length;
    return { total: tasks.length, active, completed, overdue };
  }, [tasks]);

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <p className="tasks-page__subtitle">Administra, filtra y da seguimiento a cada pendiente.</p>
        <button type="button" className="db-btn db-btn--primary" onClick={openCreateModal}>
          + Nueva tarea
        </button>
      </div>

      <div className="tasks-summary">
        <div className="tasks-summary__item">
          <span className="tasks-summary__value">{summary.total}</span>
          <span className="tasks-summary__label">Mostrando</span>
        </div>
        <div className="tasks-summary__item">
          <span className="tasks-summary__value">{summary.active}</span>
          <span className="tasks-summary__label">Activas</span>
        </div>
        <div className="tasks-summary__item">
          <span className="tasks-summary__value">{summary.completed}</span>
          <span className="tasks-summary__label">Completadas</span>
        </div>
        <div className="tasks-summary__item tasks-summary__item--warning">
          <span className="tasks-summary__value">{summary.overdue}</span>
          <span className="tasks-summary__label">Vencidas</span>
        </div>
      </div>

      <form className="tasks-filters" onSubmit={handleFilterSubmit}>
        <input
          className="db-input"
          placeholder="Buscar por título…"
          value={filters.title}
          onChange={handleFilterChange('title')}
        />
        <select className="db-select" value={filters.status} onChange={handleFilterChange('status')}>
          <option value="">Todos los estados</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select className="db-select" value={filters.priority} onChange={handleFilterChange('priority')}>
          <option value="">Todas las prioridades</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        <button type="submit" className="db-btn db-btn--ghost">
          Buscar
        </button>
        <button type="button" className="db-btn db-btn--ghost" onClick={clearFilters}>
          Limpiar
        </button>
        <select
          className="db-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar por"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Ordenar: {opt.label}
            </option>
          ))}
        </select>
      </form>

      {error && <AlertBanner tone="error">{error}</AlertBanner>}
      {actionError && <AlertBanner tone="error">{actionError}</AlertBanner>}

      {isLoading && <p className="tasks-page__loading">Cargando tareas…</p>}

      {!isLoading && tasks.length === 0 && !error && (
        <div className="tasks-empty">
          <p>No hay tareas que coincidan. Crea una nueva para empezar.</p>
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <div className="tasks-list">
          {sortedTasks.map((task) => (
            <div className={`task-card ${isOverdue(task) ? 'task-card--overdue' : ''}`} key={task._id}>
              <div className="task-card__main">
                <h3 className="task-card__title">{task.title}</h3>
                {task.description && <p className="task-card__description">{task.description}</p>}
                <div className="task-card__meta">
                  <span className={`badge badge--priority-${task.priority?.toLowerCase()}`}>
                    {PRIORITY_LABELS[task.priority] || task.priority}
                  </span>
                  <span className={`badge badge--status-${task.status?.toLowerCase()}`}>
                    {STATUS_LABELS[task.status] || task.status}
                  </span>
                  <span className="task-card__date">
                    {isOverdue(task) ? 'Venció el ' : 'Vence el '}
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              <div className="task-card__controls">
                <select
                  className="db-select db-select--sm"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  aria-label="Cambiar estado"
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>

                <select
                  className="db-select db-select--sm"
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(task, e.target.value)}
                  aria-label="Cambiar prioridad"
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </select>

                <div className="task-card__buttons">
                  <button type="button" className="db-btn db-btn--ghost db-btn--sm" onClick={() => openEditModal(task)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="db-btn db-btn--danger db-btn--sm"
                    onClick={() => handleDelete(task)}
                    disabled={deletingId === task._id}
                  >
                    {deletingId === task._id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal title={editingTask ? 'Editar tarea' : 'Nueva tarea'} onClose={closeModal}>
          {formError && <AlertBanner tone="error">{formError}</AlertBanner>}
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            isSaving={isSaving}
          />
        </Modal>
      )}
    </div>
  );
};

export default TasksPage;
