# Festival de las Luciérnagas

Un sistema integral y mágico para gestionar reservas en santuarios de luciérnagas, optimizado para administradores y visitantes. Ofrece una estética premium galardonada y un rendimiento excepcional.

## 🌟 Características Principales

*   **Página de Inicio Estética:** Interfaz oscura, elegante, con fotografías de alta calidad que simulan un bosque encantado.
*   **Sistema de Reservas en Tiempo Real:** Gestión de estancias por cabañas y camping.
*   **Dashboard de Administración:** 
    *   Gestión de inventario y datos de santuarios.
    *   Validación de llegada mediante código QR o ID manual.
    *   Visualización de métricas y listado de reservaciones y usuarios.
*   **Pase de Acceso PDF:** Generación automática de pases mágicos descargables con códigos QR integrados mediante `jsPDF`.
*   **Seguridad:** Encriptación de contraseñas con bcrypt, JWT, protección contra CSRF/XSS, y control estricto de roles.

## 🛠️ Tecnologías

### Frontend
*   React 18 con TypeScript
*   Vite
*   TailwindCSS (Styling y animaciones)
*   Framer Motion (Transiciones fluidas)
*   Lucide React (Iconografía SVG)
*   Axios y React Router

### Backend
*   Node.js y Express
*   Prisma ORM
*   SQLite (Migrable fácilmente a PostgreSQL o MySQL)
*   JWT para autenticación segura

## 🚀 Instalación y Despliegue Local

1. Clona el repositorio.
2. Navega al backend e instala dependencias (`cd backend && npm install`).
3. Ejecuta las migraciones y seed (`npm run prisma:seed`).
4. Inicia el backend (`npm run dev`).
5. Navega al frontend e instala dependencias (`cd frontend && npm install`).
6. Inicia el servidor de desarrollo Vite (`npm run dev`).

## 🔐 Seguridad y Ciclo de Vida
El software sigue un modelo iterativo e incremental, con refactorización continua para mantener "Clean Code". La seguridad está en la base de la arquitectura (RBAC, validaciones de esquemas con Zod).

> *"Preservando la magia de la naturaleza, una reserva a la vez."*
