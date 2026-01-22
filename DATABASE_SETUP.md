# 🗄️ Configuración de Base de Datos - Neon.tech

## Pasos para configurar Neon.tech (3 minutos):

### 1. Crear cuenta en Neon.tech

1. Ve a: **https://neon.tech**
2. Haz clic en **"Sign Up"** o **"Get Started"**
3. Inicia sesión con **GitHub** o **Google** (es instantáneo)

### 2. Crear tu Base de Datos

1. Una vez dentro, haz clic en **"Create a project"** o **"New Project"**
2. Configuración:
   - **Project name**: `skillforge-ai`
   - **Region**: Elige el más cercano (ej: US East, EU West)
   - **PostgreSQL version**: 16 (o la más reciente)
3. Haz clic en **"Create project"**

### 3. Obtener la Connection String

1. En tu proyecto, busca **"Connection Details"** o **"Connection String"**
2. Copia la **"Connection string"** que se ve así:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 4. Actualizar el archivo .env

1. Abre: `server/.env`
2. Reemplaza la línea 2:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillforge_ai?schema=public"
   ```
   
   Por tu connection string de Neon:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```

3. Guarda el archivo

### 5. Ejecutar las Migraciones

Abre una terminal en `server/` y ejecuta:

```bash
npx prisma migrate dev --name init
```

Esto creará todas las tablas (User, Course, Module, Lesson, Enrollment).

Deberías ver algo como:
```
✓ Your database is now in sync with your schema.
✓ Generated Prisma Client
```

---

## ✅ Verificar que todo funciona:

```bash
# Ver las tablas creadas:
npx prisma studio
```

Esto abre una interfaz web en `http://localhost:5555` donde puedes ver tus tablas.

---

## 🚀 Siguiente paso:

Una vez que las migraciones estén listas, avísame y continuamos con:
1. Iniciar el backend
2. Iniciar el frontend
3. Probar el sistema completo

---

**Alternativa rápida - Si quieres ahorrar tiempo:**

Puedes compartirme tu connection string de Neon y yo actualizo el `.env` por ti 😊
