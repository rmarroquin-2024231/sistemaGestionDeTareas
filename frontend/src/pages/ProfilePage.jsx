import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getProductivityDashboard } from '../services/productivityService.js';
import './ProfilePage.css';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
};

const formatMemberSince = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    getProductivityDashboard()
      .then((data) => active && setStats(data))
      .catch(() => active && setStats(null));
    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.nombre || user?.username || 'Usuario';
  const memberSince = formatMemberSince(user?.createdAt);

  const fields = [
    { label: 'Nombre completo', value: user?.nombre },
    { label: 'Usuario', value: user?.username ? `@${user.username}` : null },
    { label: 'Correo electrónico', value: user?.email },
    { label: 'Miembro desde', value: memberSince }
  ].filter((f) => f.value);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__cover">
          <span className="profile-card__cover-leaf" aria-hidden="true">
            🌿
          </span>
        </div>

        <div className="profile-card__header">
          <span className="profile-card__avatar">{getInitials(displayName)}</span>
          <h2 className="profile-card__name">{displayName}</h2>
          {user?.username && <span className="profile-card__handle">@{user.username}</span>}
        </div>

        <p className="profile-card__intro">Los datos de tu cuenta en Luma, tu cuaderno digital de tareas.</p>

        <dl className="profile-card__fields">
          {fields.map((field) => (
            <div className="profile-field" key={field.label}>
              <dt className="profile-field__label">{field.label}</dt>
              <dd className="profile-field__value">{field.value}</dd>
            </div>
          ))}
        </dl>

        {stats && (
          <>
            <div className="profile-card__divider" />
            <h3 className="profile-card__section-title">Tu actividad</h3>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat__value">{stats.totalTasks}</span>
                <span className="profile-stat__label">Tareas totales</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">{stats.completedTasks}</span>
                <span className="profile-stat__label">Completadas</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">{stats.completionPercentage}%</span>
                <span className="profile-stat__label">Cumplimiento</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
