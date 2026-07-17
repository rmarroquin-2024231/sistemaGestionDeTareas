import { productivityClient } from '../api/axiosClient.js';

/**
 * Contrato del microservicio service-productivity (base: /productivity/v1/productivity):
 *   GET /dashboard              resumen general
 *   GET /tasks/pending            tareas pendientes
 *   GET /tasks/overdue             tareas vencidas
 *   GET /summary/priorities         distribución por prioridad
 *   GET /statistics/completion       estadísticas de cumplimiento
 */

const BASE = '/productivity/v1/productivity';

const extractErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  return data?.message || data?.error || fallback;
};

export const getProductivityDashboard = async () => {
  try {
    const { data } = await productivityClient.get(`${BASE}/dashboard`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cargar el resumen de productividad.'));
  }
};

export const getPendingTasksSummary = async () => {
  try {
    const { data } = await productivityClient.get(`${BASE}/tasks/pending`);
    return data.data || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudieron cargar las tareas pendientes.'));
  }
};

export const getOverdueTasksSummary = async () => {
  try {
    const { data } = await productivityClient.get(`${BASE}/tasks/overdue`);
    return data.data || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudieron cargar las tareas vencidas.'));
  }
};

export const getPrioritySummary = async () => {
  try {
    const { data } = await productivityClient.get(`${BASE}/summary/priorities`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cargar el resumen de prioridades.'));
  }
};

export const getCompletionStatistics = async () => {
  try {
    const { data } = await productivityClient.get(`${BASE}/statistics/completion`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudieron cargar las estadísticas.'));
  }
};
