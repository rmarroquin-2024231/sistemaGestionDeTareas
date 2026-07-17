import { NavLink } from 'react-router-dom';
import lumaIcon from '../../assets/luma-icon-v2.png';
import { useAuth } from '../../hooks/useAuth.js';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Resumen',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    )
  },
  {
    to: '/dashboard/tasks',
    label: 'Tareas',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 5h10" />
        <path d="M9 12h10" />
        <path d="M9 19h10" />
        <path d="M4.5 5l1 1 2-2" />
        <path d="M4.5 12l1 1 2-2" />
        <path d="M4.5 19l1 1 2-2" />
      </svg>
    )
  }
];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase());
  return initials.join('') || '?';
};

const Sidebar = () => {
  const { user } = useAuth();
  const displayName = user?.nombre || user?.username || 'Usuario';

  return (
    <aside className="sidebar">
      <div className="sidebar__spine" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="sidebar__spine-ring" />
        ))}
      </div>

      <div className="sidebar__brand">
        <img src={lumaIcon} alt="Luma" className="sidebar__brand-icon" />
        <span className="sidebar__brand-word">Luma</span>
        <span className="sidebar__brand-tag">tu cuaderno de tareas</span>
      </div>

      <div className="sidebar__divider" aria-hidden="true" />

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink to="/dashboard/profile" className="sidebar__user">
        <span className="sidebar__user-avatar">{getInitials(displayName)}</span>
        <span className="sidebar__user-info">
          <span className="sidebar__user-name">{displayName}</span>
          <span className="sidebar__user-link">Ver perfil</span>
        </span>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
