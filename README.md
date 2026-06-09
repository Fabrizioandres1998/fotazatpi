# Fotaza 2

Proyecto final de Programación Web II.

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

- `usuario` – Usuarios del sistema, con roles (común o moderador)
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
- Me interesa (con AJAX)
- Colecciones privadas para guardar publicaciones
- Buscador de publicaciones y usuarios

### Reportes y moderación

- Reportar publicaciones (spam, violencia, odio, copyright)
- Reportar comentarios
- Panel de moderador para gestionar reportes
- Eliminación automática de publicaciones con 3+ reportes

### Interacción social

- Notificaciones
- Mensajería privada entre usuarios tras dar "Me interesa"
- Feed de publicaciones de usuarios seguidos

### Experiencia de usuario

- Interfaz básica hecha con Bootstrap
- Peticiones AJAX para acciones sin recarga de página
- Modales interactivos
- Carrusel de imágenes

---

## Instalación local

### 1. Clonar repositorio

````bash
git clone URL_DEL_REPO
cd fotaza

### 2. Instalar dependencias

```bash
npm install
````
---

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

---

### 4. Inicializar la base de datos

Ejecutar las migraciones para crear las tablas necesarias:

```bash
npx sequelize-cli db:migrate
```

---

### 5. Iniciar la aplicación

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
Usuario: moderador
Contraseña: [completar]
```

### Usuario común

```txt
Usuario: usuario1
Contraseña: [completar]
```

---

## Despliegue

La aplicación se encuentra desplegada y accesible públicamente en:

```txt
https://fotazatpi-production.up.railway.app/
```

---

## Base de datos

El proyecto incluye un archivo SQL de respaldo en la raíz del repositorio que permite recrear la base de datos con información de prueba.

Este respaldo incluye:

- Usuarios de prueba
- Publicaciones de ejemplo
- Etiquetas
- Comentarios
- Valoraciones
- Configuración necesaria para probar la aplicación

---

## Estructura del proyecto

```txt
fotaza/
├── bin/
├── config/
├── middlewares/
├── migrations/
├── models/
├── public/
├── routes/
├── views/
├── app.js
├── package.json
└── README.md
```
