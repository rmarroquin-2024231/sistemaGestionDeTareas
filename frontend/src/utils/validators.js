const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/;
const MIN_PASSWORD_LENGTH = 6;

export const validateRegisterForm = ({ nombre, username, email, password, confirmPassword }) => {
  const errors = {};

  if (!nombre || nombre.trim().length < 2) {
    errors.nombre = 'Ingresa al menos 2 caracteres.';
  }

  if (!username || !USERNAME_REGEX.test(username)) {
    errors.username = 'Usa 3-20 caracteres: letras, números, "_" o ".".';
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
};

export const validateLoginForm = ({ identifier, password }) => {
  const errors = {};

  if (!identifier) {
    errors.identifier = 'Ingresa tu correo o usuario.';
  }

  if (!password) {
    errors.password = 'Ingresa tu contraseña.';
  }

  return errors;
};
