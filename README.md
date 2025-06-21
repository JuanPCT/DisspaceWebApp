# DisspaceWebApp

A minimal Node.js and Express application using EJS templates.

## Requisitos

- Node.js 14 o superior
- MySQL en ejecución

## Instalación

1. Clona el repositorio y accede a la carpeta:
   ```bash
   git clone <repo-url>
   cd DisspaceWebApp
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Variables de entorno

Crea un archivo `.env` en la raíz con el siguiente contenido como ejemplo:

```dotenv
PORT=5000
MYSQL_URI=mysql://user:password@localhost:3306/mi_basededatos
```

- `PORT` es opcional (5000 por defecto).
- `MYSQL_URI` debe apuntar a tu instancia de MySQL.

## Uso

Para iniciar el servidor:

```bash
npm start
```

Accede a `http://localhost:PORT` en tu navegador.
