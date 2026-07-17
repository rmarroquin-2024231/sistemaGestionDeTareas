# Luma — Frontend

Frontend del sistema de gestión de tareas. Consume los microservicios del backend
(`service-auth`, `service-tasks`, `service-productivity`) de forma independiente, con su
propia configuración, dependencias y estructura de carpetas.

## Stack

- React 18 + Vite
- React Router v6
- Axios
- CSS con variables (sin librerías de UI externas), tema claro cálido: cuaderno sobre escritorio de madera, con acentos naturales

## Estructura

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                 # Clientes HTTP por microservicio
│   │   └── axiosClient.js
│   ├── components/          # Componentes reutilizables de UI
│   │   └── dashboard/         # Sidebar, Navbar, Modal, formulario de tareas
│   ├── context/               # AuthContext (sesión, token, usuario)
│   ├── hooks/                  # useAuth
│   ├── layouts/                  # DashboardLayout (navbar + sidebar + outlet)
│   ├── pages/                     # Login, Register, DashboardHome, TasksPage
│   ├── services/                    # authService, taskService, productivityService
│   ├── styles/                        # dashboard-ui.css (inputs, botones, badges)
│   ├── utils/                          # Validadores de formularios
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                        # Tokens de diseño (colores, tipografía)
├── index.html
├── package.json
└── vite.config.js
```

## Cómo correrlo

```bash
cd frontend
npm install
cp .env.example .env   # ajusta las URLs al puerto real de cada servicio backend
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Páginas incluidas

- **`/login`** — Inicio de sesión (`identifier` + `password`, acepta correo o usuario).
- **`/register`** — Registro de usuario (`nombre`, `username`, `email`, `password`).
- **`/dashboard`** — Resumen de productividad: tareas totales, completadas, pendientes, vencidas y distribución por prioridad (consume `service-productivity`).
- **`/dashboard/tasks`** — Gestión completa de tareas: crear, editar, eliminar, buscar/filtrar por título, estado y prioridad, y cambiar estado o prioridad al vuelo (consume `service-tasks`).

Ambos formularios de auth validan en el cliente con las mismas reglas del backend
(`src/auth/auth.controller.js` de `service-auth`) antes de llamar a la API, y muestran
los mensajes de error que el backend devuelve (correo duplicado, credenciales inválidas, etc.).

## Servicios backend consumidos

| Servicio | Base path | Endpoints usados |
|---|---|---|
| `service-auth` | `/auth` | `POST /register`, `POST /login` |
| `service-tasks` | `/tasks/v1/tasks` | `GET /`, `GET /search`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/status`, `PATCH /:id/priority`, `PATCH /:id/due-date` |
| `service-productivity` | `/productivity/v1/productivity` | `GET /dashboard`, `GET /tasks/pending`, `GET /tasks/overdue`, `GET /summary/priorities`, `GET /statistics/completion` |

Todas las rutas de `service-tasks` y `service-productivity` requieren el JWT emitido por
`service-auth`; el cliente Axios lo añade automáticamente desde `localStorage` (`luma_token`)
en cada petición, y cierra la sesión localmente si el backend responde `401`.

## Próximos servicios

Cuando se agreguen nuevos microservicios, se sumará un cliente en `src/api/`, un servicio en
`src/services/` y sus páginas correspondientes en `src/pages/`, siguiendo el mismo patrón que
`taskService.js` y `productivityService.js`.
