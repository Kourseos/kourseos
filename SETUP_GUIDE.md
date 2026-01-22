# Guía de Configuración y Prueba - SkillForge AI

## 📋 Checklist de Configuración

### 1️⃣ **Configurar API Key de Google Gemini**

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una API Key gratuita
3. Copia la API Key
4. Edita el archivo `server/.env` y reemplaza:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
   Por tu API Key real:
   ```env
   GEMINI_API_KEY="TU_API_KEY_AQUÍ"
   ```

### 2️⃣ **Configurar PostgreSQL**

**Opción A: PostgreSQL Local**
1. Asegúrate de tener PostgreSQL instalado y corriendo
2. Crea la base de datos:
   ```sql
   CREATE DATABASE skillforge_ai;
   ```
3. Verifica que las credenciales en `.env` sean correctas:
   ```env
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/skillforge_ai?schema=public"
   ```

**Opción B: PostgreSQL en la Nube (Recomendado para pruebas rápidas)**
- Usa [Neon](https://neon.tech) o [Supabase](https://supabase.com) (gratis)
- Crea una base de datos
- Copia la connection string y actualiza `DATABASE_URL` en `.env`

### 3️⃣ **Ejecutar Migraciones de Base de Datos**

Abre una terminal en `server/`:
```bash
cd server
npx prisma migrate dev --name init
```

Esto creará todas las tablas (User, Course, Module, Lesson, Enrollment).

### 4️⃣ **Verificar que todo compile**

```bash
# Backend
cd server
npm run build

# Frontend
cd ../client
npm run build
```

### 5️⃣ **Iniciar los Servicios**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Deberías ver: `Server running on port 3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Deberías ver: `Local: http://localhost:5173/`

---

## 🧪 Plan de Pruebas

### Test 1: Registro de Usuario
1. Abre `http://localhost:5173`
2. Serás redirigido a `/login`
3. Click en "start your 14-day free trial" o ve a `/register`
4. Llena el formulario:
   - **Name**: Tu Nombre
   - **Email**: test@example.com
   - **Password**: password123
   - **Role**: CREATOR
5. Click "Sign up"
6. Deberías ser redirigido al Dashboard

### Test 2: Generar Curso con IA
1. En el Dashboard, click "Create New Course"
2. Ingresa un topic, por ejemplo: `"Introduction to Machine Learning"`
3. Click "Generate Curriculum"
4. Espera ~5-10 segundos mientras la IA genera la estructura
5. Verifica que aparezcan módulos y lecciones
6. Click "Save Course"
7. Deberías volver al Dashboard

### Test 3: AI Tutor (requiere curso guardado)
1. Necesitarás el `courseId` del curso que guardaste
2. Ve manualmente a: `http://localhost:5173/course/COURSE_ID`
3. Deberías ver:
   - Sidebar con módulos y lecciones
   - Contenido de la lección
   - Chat widget a la derecha
4. Escribe una pregunta en el chat, por ejemplo: "What is supervised learning?"
5. El AI Tutor debería responder basado en el contenido del curso

### Test 4: Login/Logout
1. Click "Logout" en el Dashboard
2. Intenta acceder a `/dashboard` directamente
3. Deberías ser redirigido a `/login`
4. Login con las credenciales que creaste
5. Deberías volver al Dashboard

---

## 🐛 Troubleshooting

### Error: "Failed to generate course structure"
- ✅ Verifica que `GEMINI_API_KEY` esté configurada correctamente
- ✅ Verifica tu conexión a internet
- ✅ Revisa la consola del navegador (F12) para más detalles

### Error: "Database error" o "Prisma error"
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica que `DATABASE_URL` en `.env` sea correcta
- ✅ Ejecuta: `npx prisma migrate reset` y luego `npx prisma migrate dev`

### Error: "Cannot find module"
- ✅ Ejecuta `npm install` en ambos directorios (`server/` y `client/`)

### Puerto 3000 ya está en uso
- ✅ Cambia `PORT=3001` en `server/.env`
- ✅ Actualiza las URLs en el frontend (busca `http://localhost:3000` y reemplaza por `3001`)

---

## ✅ Checklist Final

Antes de pasar a Fase 3, verifica que:

- [ ] Puedes registrarte como CREATOR
- [ ] Puedes generar un curso con IA
- [ ] El curso se guarda correctamente
- [ ] Puedes ver el curso en CourseView (aunque sea manualmente con la URL)
- [ ] El AI Tutor responde preguntas
- [ ] Login/Logout funciona correctamente

---

## 📝 Notas Importantes

- **Seguridad del JWT_SECRET**: En producción, usa un secreto más robusto
- **GEMINI_API_KEY**: No compartas esta clave públicamente
- **DATABASE_URL**: Mantén tus credenciales seguras

---

¿Listo para empezar? Sigue los pasos en orden y avísame si encuentras algún problema! 🚀
