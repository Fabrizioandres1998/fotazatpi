# Fotaza

Trabajo práctico integrador de Programación Web II.

Aplicación web para compartir imagenes en línea desarrollada con Node.js.

---

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework para node.js
- **Pug** - Motor de plantillas
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **Bootstrap** - Framework CSS
- **bcrypt** - Encriptación de contraseñas
- **express-session** - Manejo de sesiones
- **dotenv** - Variables de entorno
- **Railway** - Plataforma de deploy y bd online

---

## Modelo de datos

- `usuario` – Usuarios del sistema, con roles (usuario o moderador)
- `publicacion` – Publicaciones creadas por los usuarios
- `imagen` – Imágenes asociadas a cada publicación
- `comentario` – Comentarios en las publicaciones
- `etiqueta` – Etiquetas para clasificar publicaciones
- `publicacion_etiqueta` – Relación entre publicaciones y etiquetas
- `valoracion` – Puntaje que los usuarios le dan a las publicaciones
- `me_interesa` – Interés de un usuario por una publicación
- `follower` – Relación de seguimiento entre usuarios
- `coleccion` – Colecciones privadas creadas por un usuario
- `coleccion_publicacion` – Relación entre colecciones y publicaciones
- `mensaje` – Mensajes privados entre usuarios
- `notificacion` – Notificaciones del sistema (me interesa, valoraciones, mensajes)
- `reporte_publicacion` – Reportes sobre publicaciones
- `reporte_comentario` – Reportes sobre comentarios
- `Sessions` – Sesiones de usuario

---

## Funcionalidades

### Usuarios

- Registro e inicio de sesión
- Perfiles públicos con publicaciones
- Seguidores/seguidos
- Inactivación de usuarios (tras 3 publicaciones eliminadas)

### Publicaciones

- Crear publicaciones con hasta tres imágenes
- Valorar publicaciones (1-5 puntos)
- Sistema de comentarios
- Etiquetas para organizar contenido
- Me interesa
- Colecciones privadas para guardar publicaciones
- Buscador de publicaciones y usuarios

### Reportes y moderación

- Reportar publicaciones
- Reportar comentarios
- Panel de moderador para gestionar reportes
- Eliminación automática de publicaciones con 3+ reportes (se dan de baja y se pueden reactivar desde la bd)

### Interacción social

- Notificaciones
- Mensajería privada entre usuarios tras dar "Me interesa"
- Feed de publicaciones de usuarios seguidos

### Experiencia de usuario

- Interfaz básica estándar y funcional hecha con Bootstrap
- Modales interactivos
- Carrusel de imágenes

---

## Instalación local

### 1. Clonar repositorio

```bash
git clone https://github.com/Fabrizioandres1998/fotazatpi
cd fotazatpi
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto utilizando como referencia el archivo `.env.example`.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fotaza
DB_USER=root
DB_PASSWORD=tu_password
SESSION_SECRET=tu_clave_secreta
```

### 4. Crear la base de datos

Instalar MySQL Server si no se encuentra instalado en el sistema.

Ingresar al cliente MySQL:

```bash
mysql -u tu_usuario -p
```

Crear una base de datos vacía llamada `fotaza`:

```sql
CREATE DATABASE fotaza;
```

Verificar que fue creada:

```sql
SHOW DATABASES;
```

Salir del cliente MySQL:

```sql
EXIT;
```

También puede crearse utilizando MySQL Workbench.

### 5. Inicializar la base de datos

Ejecutar las migraciones para crear todas las tablas necesarias:

```bash
npm run db:init
```

### 6. Iniciar la aplicación

```bash
npm start
```

La aplicación quedará disponible en:

```txt
http://localhost:3000
```

---

## Usuarios de prueba

### Moderador

```txt
Mail: moderador@gmail.com
Contraseña: moderador123
```

### Usuario común

```txt
Mail: fabrizioandres98@gmail.com
Contraseña: 123456
```

### Usuario común

```txt
Mail: vati77@gmail.com
Contraseña: 123456
```

### Usuario común

```txt
Mail: prueba12@gmail.com
Contraseña: 654321
```

### Usuario común

```txt
Mail: chino123@gmail.com
Contraseña: hola123
```

---

## Despliegue

La aplicación se encuentra desplegada y accesible públicamente en:

```txt
https://fotazatpi-production.up.railway.app/
```

---

## Problemas encontrados y soluciones

1. **Railway no inyectaba variables de entorno** → Se agregaron manualmente en el panel.
2. **`sequelize-cli` sin permisos en Railway** → Se instaló globalmente dentro del contenedor.
3. **Sesiones no persistentes en deploy** → Se creó la tabla `Sessions` manualmente en la bd de Railway.

---

## Base de datos

El proyecto incluye un archivo SQL de respaldo en la raíz del repositorio que permite recrear la base de datos con información de prueba.

Este respaldo incluye:

- Usuarios de prueba
- Publicaciones de ejemplo
- Etiquetas
- Comentarios
- Valoraciones
- Colecciones
- Chats
- Notificaciones

---

## Estructura del proyecto

```txt
fotazatpi/
├── bin/
├── config/
├── middlewares/
├── migrations/
├── models/
├── public/
├── routes/
├── views/
├── app.js
├── backup.sql
├── .env.example
├── package.json
└── README.md
```
