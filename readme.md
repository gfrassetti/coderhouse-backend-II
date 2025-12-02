# Ecommerce Backend

Backend de ecommerce desarrollado con Node.js, Express, MongoDB y Passport.js.

## Características

- Autenticación con JWT y roles (admin/user)
- Patrón Repository y DTOs
- CRUD de usuarios, productos, carritos y tickets
- Sistema de compras con validación de stock
- Recuperación de contraseña por email
- Middleware de autorización por roles

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` con:
```
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/class-zero
JWT_SECRET=tu_secreto_jwt
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=noreply@ecommerce.com
FRONTEND_URL=http://localhost:3000
PASSWORD_RESET_EXPIRATION=3600
```

3. Ejecutar:
```bash
npm start
```

## Estructura

```
src/
├── config/          Configuración
├── dao/             Data Access Objects
├── dto/             Data Transfer Objects
├── middleware/      Middlewares
├── models/          Modelos de Mongoose
├── repositories/    Repositories
├── routes/          Rutas
├── services/        Servicios
├── utils/           Utilidades
└── app.js           App principal
```

## Endpoints

### Sesiones (`/api/sessions`)
- `POST /register` - Registrar usuario
- `POST /login` - Login (devuelve JWT)
- `GET /current` - Usuario actual
- `POST /password-reset/request` - Solicitar reset
- `POST /password-reset/reset` - Reset con token

### Usuarios (`/api/users`)
- `GET /` - Listar
- `POST /` - Crear
- `PUT /:uid` - Actualizar
- `DELETE /:uid` - Eliminar

### Productos (`/api/products`)
- `GET /` - Listar (filtros: ?status=true&category=electronics)
- `GET /:pid` - Por ID
- `POST /` - Crear (solo admin)
- `PUT /:pid` - Actualizar (solo admin)
- `DELETE /:pid` - Eliminar (solo admin)

### Carritos (`/api/carts`)
- `GET /` - Carrito del usuario
- `POST /products/:pid` - Agregar producto
- `PUT /products/:pid` - Actualizar cantidad
- `DELETE /products/:pid` - Eliminar producto
- `DELETE /` - Vaciar carrito

### Tickets (`/api/tickets`)
- `POST /purchase` - Procesar compra
- `GET /` - Listar tickets del usuario
- `GET /:tid` - Ticket por ID

## Autenticación

Las rutas protegidas requieren JWT en el header:
```
Authorization: Bearer <token>
```

**Roles:**
- `admin`: Puede gestionar productos
- `user`: Puede usar carrito y comprar

## Flujo de Compra

1. Agregar productos al carrito
2. Procesar compra: `POST /api/tickets/purchase`
3. Se valida stock, se genera ticket y se envía email

## Notas

- Contraseñas encriptadas con bcrypt
- Tokens JWT expiran en 1h
- Tokens de reset expiran en 1h
- No se puede reutilizar la contraseña anterior

## Licencia

ISC
