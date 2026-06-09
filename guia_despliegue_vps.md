# Guía de Despliegue en VPS (Servidor Propio) para LuciMap

Esta guía asume que tienes un servidor con **Ubuntu/Debian**, acceso SSH, y conocimientos básicos de terminal.

## Fase 1: Preparación en tu Computadora Local

Antes de subir los archivos, vamos a preparar el código para producción.

1. **Compilar el Backend**:
   Abre una terminal en la carpeta `backend` y ejecuta:
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```
   Esto creará una carpeta `/dist` con el código Javascript optimizado.

2. **Compilar el Frontend**:
   Abre una terminal en la carpeta `frontend`.
   Primero, asegúrate de que tu archivo `.env` apunte a la IP de tu servidor o dominio.
   Ejemplo de `.env` en frontend: `VITE_API_URL=http://TUPUBLICA_IP_O_DOMINIO/api`
   Luego compila:
   ```bash
   npm install
   npm run build
   ```
   Esto creará una carpeta `/dist` con los archivos estáticos de tu página web.

## Fase 2: Configuración del Servidor (VPS)

Conéctate por SSH a tu servidor y ejecuta los siguientes comandos para instalar lo necesario:

```bash
# 1. Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2 (Gestor de procesos para mantener el backend encendido siempre)
sudo npm install -g pm2

# 4. Instalar Nginx (Servidor web para entregar tu frontend)
sudo apt install nginx -y
```

## Fase 3: Transferir y Configurar Archivos

Crea una carpeta en tu servidor para alojar el proyecto, por ejemplo `/var/www/lucimap`.
Debes subir a esa carpeta:
- Para el **Frontend**: Todo el contenido de la carpeta `frontend/dist`.
- Para el **Backend**: La carpeta `backend/dist`, `backend/prisma`, `backend/package.json` y el archivo `backend/.env`.

### 1. Iniciar el Backend con PM2
Dentro de la carpeta de tu backend en el servidor:
```bash
npm install --production
npx prisma generate
npx prisma db push # Para recrear las tablas de SQLite en el servidor

# Iniciar la app
pm2 start dist/app.js --name "lucimap-api"

# Hacer que PM2 inicie automáticamente si el servidor se reinicia
pm2 startup
pm2 save
```

### 2. Configurar Nginx para el Frontend
Nginx se encargará de mostrar tu página y de redirigir todo lo que empiece con `/api` hacia tu backend local en el puerto 4000.

Crea un archivo de configuración para Nginx:
```bash
sudo nano /etc/nginx/sites-available/lucimap
```

Pega esta configuración (cambia `TUPUBLICA_IP` por la IP real o tu dominio):
```nginx
server {
    listen 80;
    server_name TUPUBLICA_IP; # Cambia esto por tu dominio o IP

    # Ruta al Frontend
    root /var/www/lucimap/frontend/dist; # Asegúrate que esta ruta exista
    index index.html;

    # Entregar el Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirigir la API al Backend en PM2
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activa la configuración y reinicia Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/lucimap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## ¡Listo!
Ahora, si visitas la IP de tu servidor desde el navegador, deberías ver la página principal de LuciMap. El sistema de registro, login y reservas interactuará correctamente con tu base de datos de producción a través de Nginx.
