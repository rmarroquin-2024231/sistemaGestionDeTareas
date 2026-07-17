import { authClient } from '../api/axiosClient.js';

/**
 * Contrato del microservicio service-auth:
 *   POST /auth/register { nombre, username, email, password } -> { user }
 *   POST /auth/login    { identifier, password }               -> { user, token }
 */

const extractErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join('. ');
  }
  return data?.message || fallback;
};

export const registerRequest = async ({ nombre, username, email, password }) => {
  try {
    const { data } = await authClient.post('/auth/register', {
      nombre,
      username,
      email,
      password
    });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo completar el registro.'));
  }
};

export const loginRequest = async ({ identifier, password }) => {
  try {
    const { data } = await authClient.post('/auth/login', { identifier, password });
    return { user: data.user, token: data.token };
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo iniciar sesión.'));
  }
};
