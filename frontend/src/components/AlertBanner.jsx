import './AlertBanner.css';

const AlertBanner = ({ tone = 'error', children }) => {
  if (!children) return null;

  return (
    <div className={`alert alert--${tone}`} role="status">
      {children}
    </div>
  );
};

export default AlertBanner;
