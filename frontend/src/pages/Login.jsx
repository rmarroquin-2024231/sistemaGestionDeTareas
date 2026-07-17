import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateLoginForm } from '../utils/validators.js';

const INITIAL_FORM = { identifier: '', password: '' };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const successMessage = location.state?.registered
    ? 'Cuenta creada con éxito. Ahora inicia sesión.'
    : '';

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    const errors = validateLoginForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Qué bueno verte"
      title="Inicia sesión"
      subtitle="Abre tu cuaderno y retoma tus pendientes justo donde los dejaste."
      footer={
        <>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>
        </>
      }
    >
      <form className="auth-card__body" onSubmit={handleSubmit} noValidate>
        {apiError && <AlertBanner tone="error">{apiError}</AlertBanner>}
        {!apiError && successMessage && <AlertBanner tone="success">{successMessage}</AlertBanner>}

        <FormField
          label="Correo o usuario"
          placeholder="tu@empresa.com"
          value={form.identifier}
          onChange={handleChange('identifier')}
          error={fieldErrors.identifier}
          autoComplete="username"
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <PrimaryButton isLoading={isLoading}>Iniciar sesión</PrimaryButton>
      </form>
    </AuthLayout>
  );
};

export default Login;
