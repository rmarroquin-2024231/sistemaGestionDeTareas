import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProductivityDashboard,
  getPendingTasksSummary,
  getOverdueTasksSummary
} from '../services/productivityService.js';
import { useAuth } from '../hooks/useAuth.js';
import AlertBanner from '../components/AlertBanner.jsx';
import PieChart from '../components/dashboard/PieChart.jsx';
import { getGreeting } from '../utils/time.js';
import './DashboardHome.css';

const PRIORITY_LABELS = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' };
const PRIORITY_DOT = { BAJA: 'var(--priority-baja)', MEDIA: 'var(--priority-media)', ALTA: 'var(--priority-alta)' };
const LIST_LIMIT = 5;

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short' });
};

const daysOverdue = (value) => {
  if (!value) return null;
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return null;
  const diff = Math.floor((Date.now() - due.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
};

const sortByDueDateAsc = (tasks) =>
  [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

const TaskRow = ({ task, rightSlot }) => (
  <li className="task-row">
    <span className="task-row__dot" style={{ background: PRIORITY_DOT[task.priority] || 'var(--ink-muted)' }} />
    <span className="task-row__title">{task.title}</span>
    {rightSlot}
  </li>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [overdueList, setOverdueList] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [dashboardResult, pendingResult, overdueResult] = await Promise.all([
          getProductivityDashboard(),
          getPendingTasksSummary().catch(() => []),
          getOverdueTasksSummary().catch(() => [])
        ]);
        if (!active) return;

        setData(dashboardResult);
        setPendingList(sortByDueDateAsc(pendingResult).slice(0, LIST_LIMIT));
        setOverdueList(sortByDueDateAsc(overdueResult).slice(0, LIST_LIMIT));
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    const greetingInterval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => {
      active = false;
      clearInterval(greetingInterval);
    };
  }, []);

  const firstName = user?.nombre?.split(' ')[0] || user?.username || '';

  const priorityData = useMemo(
    () =>
      data
        ? [
            { label: PRIORITY_LABELS.BAJA, value: data.priorityDistribution?.BAJA || 0, color: 'var(--priority-baja)' },
            { label: PRIORITY_LABELS.MEDIA, value: data.priorityDistribution?.MEDIA || 0, color: 'var(--priority-media)' },
            { label: PRIORITY_LABELS.ALTA, value: data.priorityDistribution?.ALTA || 0, color: 'var(--priority-alta)' }
          ]
        : [],
    [data]
  );

  const completionData = useMemo(
    () =>
      data
        ? [
            { label: 'Completadas', value: data.completedTasks, color: 'var(--status-complete)' },
            {
              label: 'Por completar',
              value: Math.max(0, data.totalTasks - data.completedTasks),
              color: 'var(--status-remaining)'
            }
          ]
        : [],
    [data]
  );

  return (
    <div className="home">
      <span className="home__greeting">{greeting}{firstName ? `, ${firstName}` : ''}</span>
      <p className="home__welcome">
        Qué bueno verte{firstName ? `, ${firstName}` : ''}. Este es el estado de tus tareas hoy.
      </p>

      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      {isLoading && !data && <p className="home__loading">Cargando tu resumen…</p>}

      {data && (
        <div className="home__layout">
          <div className="stat-stack">
            <div className="stat-card">
              <span className="stat-card__label">Tareas totales</span>
              <span className="stat-card__value">{data.totalTasks}</span>
            </div>
            <div className="stat-card stat-card--accent">
              <span className="stat-card__label">Completadas</span>
              <span className="stat-card__value">{data.completedTasks}</span>
              <span className="stat-card__sub">{data.completionPercentage}% del total</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Pendientes</span>
              <span className="stat-card__value">{data.pendingTasks}</span>
            </div>
            <div className="stat-card stat-card--warning">
              <span className="stat-card__label">Vencidas</span>
              <span className="stat-card__value">{data.overdueTasks}</span>
            </div>
          </div>

          <div className="home__panels">
            <section className="panel">
              <h2 className="panel__title">Distribución por prioridad</h2>
              <PieChart data={priorityData} size={160} />
            </section>

            <section className="panel">
              <h2 className="panel__title">Cumplimiento</h2>
              <PieChart data={completionData} size={160} />
            </section>

            <section className="panel panel--list">
              <div className="panel__list-header">
                <h2 className="panel__title">Tareas pendientes</h2>
                {data.pendingTasks > 0 && <span className="panel__count">{data.pendingTasks}</span>}
              </div>
              {pendingList.length === 0 ? (
                <p className="panel__empty">No tienes tareas pendientes. 🎉</p>
              ) : (
                <ul className="task-row-list">
                  {pendingList.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      rightSlot={<span className="task-row__date">{formatDate(task.dueDate)}</span>}
                    />
                  ))}
                </ul>
              )}
              {data.pendingTasks > LIST_LIMIT && (
                <Link to="/dashboard/tasks" className="panel__link panel__link--sm">
                  Ver las {data.pendingTasks} pendientes →
                </Link>
              )}
            </section>

            <section className="panel panel--list panel--danger">
              <div className="panel__list-header">
                <h2 className="panel__title">Tareas vencidas</h2>
                {data.overdueTasks > 0 && <span className="panel__count panel__count--danger">{data.overdueTasks}</span>}
              </div>
              {overdueList.length === 0 ? (
                <p className="panel__empty">¡Estás al día! No tienes tareas vencidas.</p>
              ) : (
                <ul className="task-row-list">
                  {overdueList.map((task) => {
                    const days = daysOverdue(task.dueDate);
                    return (
                      <TaskRow
                        key={task._id}
                        task={task}
                        rightSlot={
                          <span className="task-row__date task-row__date--danger">
                            {days === 0 ? 'Venció hoy' : `${days} ${days === 1 ? 'día' : 'días'} tarde`}
                          </span>
                        }
                      />
                    );
                  })}
                </ul>
              )}
              {data.overdueTasks > LIST_LIMIT && (
                <Link to="/dashboard/tasks" className="panel__link panel__link--sm">
                  Ver las {data.overdueTasks} vencidas →
                </Link>
              )}
            </section>
          </div>

          <div className="panel panel--cta">
            <div>
              <h2 className="panel__title">¿Listo para avanzar?</h2>
              <p className="panel__text">Crea una tarea nueva o revisa el detalle completo en el módulo de tareas.</p>
            </div>
            <Link to="/dashboard/tasks" className="db-btn db-btn--primary">
              Ir a Tareas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
