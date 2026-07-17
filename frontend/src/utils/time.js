const GT_TIMEZONE = 'America/Guatemala';

// Hora actual en Guatemala (0-23), sin importar la zona horaria del navegador.
export const getGuatemalaHour = (date = new Date()) => {
  const hourString = new Intl.DateTimeFormat('en-US', {
    timeZone: GT_TIMEZONE,
    hour: 'numeric',
    hour12: false
  }).format(date);

  // Intl puede devolver "24" para medianoche en algunos entornos; lo normalizamos a 0.
  const hour = Number(hourString);
  return hour === 24 ? 0 : hour;
};

export const getGreeting = (date = new Date()) => {
  const hour = getGuatemalaHour(date);
  if (hour < 12) return 'Buenos días ☀️';
  if (hour < 19) return 'Buenas tardes ☕';
  return 'Buenas noches 🌙';
};

export const formatGuatemalaClock = (date = new Date()) => {
  return new Intl.DateTimeFormat('es-GT', {
    timeZone: GT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
};

export const formatGuatemalaDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('es-GT', {
    timeZone: GT_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
};
