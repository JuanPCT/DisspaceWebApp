# DisspaceWebApp

Aplicación web para Disspace - Plataforma de gestión y colaboración

## Descripción

Este proyecto contiene la aplicación web principal de Disspace, una plataforma diseñada para facilitar la gestión y colaboración en proyectos.

## Tecnologías

- **Backend:** Node.js + Express.js
- **Motor de plantillas:** EJS
- **Base de datos:** MySQL
- **Autenticación:** Sesiones con bcryptjs
- **Estilos:** CSS3 + Bootstrap (opcional)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JuanPCT/DisspaceWebApp.git

# Navegar al directorio
cd DisspaceWebApp

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones de base de datos

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## Configuración de Base de Datos

1. Crear una base de datos MySQL llamada `disspace_db`
2. Configurar las credenciales en el archivo `.env`
3. La aplicación creará automáticamente las tablas necesarias

## Estructura del proyecto

```
DisspaceWebApp/
├── controllers/
│   ├── authController.js
│   └── homeController.js
├── models/
│   ├── database.js
│   └── User.js
├── routes/
│   ├── auth.js
│   └── index.js
├── views/
│   ├── layouts/
│   │   └── layout.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   └── index.ejs
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
├── server.js
├── package.json
└── .env
```

## Características

- ✅ Sistema de autenticación (Login/Registro)
- ✅ Gestión de sesiones
- ✅ Validación de datos
- ✅ Seguridad con Helmet
- ✅ Hash de contraseñas con bcrypt
- ✅ Arquitectura MVC
- ✅ Templates con EJS

## API Endpoints

### Autenticación
- `GET /` - Página principal
- `GET /auth/login` - Formulario de login
- `POST /auth/login` - Procesar login
- `GET /auth/register` - Formulario de registro
- `POST /auth/register` - Procesar registro
- `POST /auth/logout` - Cerrar sesión

## Variables de Entorno

Crear un archivo `.env` con:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=disspace_db
SESSION_SECRET=tu_clave_secreta_muy_segura
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Juan - [@JuanPCT](https://github.com/JuanPCT)

Link del proyecto: [https://github.com/JuanPCT/DisspaceWebApp](https://github.com/JuanPCT/DisspaceWebApp)
