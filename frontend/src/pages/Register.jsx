import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateRegisterForm } from '../utils/validators.js';

const INITIAL_FORM = { nombre: '', username: '', email: '', password: '', confirmPassword: '' };

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    const errors = validateRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { nombre, username, email, password } = form;
      await register({ nombre, username, email, password });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Pasa, siéntate"
      title="Crea tu cuenta"
      subtitle="Un cuaderno digital para tu equipo, con la calma de una tarde de enfoque."
      footer={
        <>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </>
      }
    >
      <form className="auth-card__body" onSubmit={handleSubmit} noValidate>
        {apiError && <AlertBanner tone="error">{apiError}</AlertBanner>}

        <FormField
          label="Nombre completo"
          placeholder="Ana Martínez"
          value={form.nombre}
          onChange={handleChange('nombre')}
          error={fieldErrors.nombre}
          autoComplete="name"
        />

        <FormField
          label="Usuario"
          placeholder="ana.martinez"
          value={form.username}
          onChange={handleChange('username')}
          error={fieldErrors.username}
          autoComplete="username"
        />

        <FormField
          label="Correo electrónico"
          type="email"
          placeholder="ana@empresa.com"
          value={form.email}
          onChange={handleChange('email')}
          error={fieldErrors.email}
          autoComplete="email"
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={handleChange('password')}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <FormField
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <PrimaryButton isLoading={isLoading}>Crear cuenta</PrimaryButton>
      </form>
    </AuthLayout>
  );
};

export default Register;
