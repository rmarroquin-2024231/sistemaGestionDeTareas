import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Clock from './Clock.jsx';
import './Navbar.css';

const TITLES = {
  '/dashboard': 'Resumen',
  '/dashboard/tasks': 'Tareas',
  '/dashboard/profile': 'Mi Perfil'
};

const getTitle = (pathname) => {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/dashboard/tasks')) return 'Tareas';
  if (pathname.startsWith('/dashboard/profile')) return 'Mi Perfil';
  return 'Panel';
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const firstName = user?.nombre?.split(' ')[0] || user?.username || '';

  return (
    <header className="navbar">
      <h1 className="navbar__title">{getTitle(location.pathname)}</h1>

      <div className="navbar__actions">
        <Clock />
        {firstName && <span className="navbar__greeting">Hola, {firstName}</span>}
        <button className="navbar__logout" onClick={logout} type="button">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
