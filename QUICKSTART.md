# 🚀 Inicio Rápido - SkillForge AI

## ✅ PRE-REQUISITOS

Antes de empezar, asegúrate de tener:

1. **Google Gemini API Key** (GRATIS)
   - Ve a: https://aistudio.google.com/app/apikey
   - Inicia sesión con tu cuenta de Google
   - Haz clic en "Create API Key"
   - Copia la clave generada

2. **PostgreSQL** instalado y corriendo
   - O usa una base de datos en la nube (Neon.tech o Supabase - GRATIS)

---

## 📝 CONFIGURACIÓN (Solo la primera vez)

### 1. Configura tu API Key de Gemini

Abre el archivo: `server/.env`

Reemplaza esta línea:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

Por tu clave real:
```env
GEMINI_API_KEY="AIzaSy..."  # Tu clave aquí
```

### 2. Configura la Base de Datos

**Opción A - PostgreSQL Local:**
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/skillforge_ai?schema=public"
```

**Opción B - Neon (Recomendado para pruebas):**
1. Ve a https://neon.tech y crea una cuenta gratuita
2. Crea un proyecto llamado "skillforge-ai"
3. Copia la "Connection String"
4. Pégala en `DATABASE_URL` del archivo `.env`

### 3. Ejecuta las Migraciones de Base de Datos

Abre una terminal en la carpeta `server/`:

```bash
cd server
npx prisma migrate dev --name init
```

Esto creará todas las tablas necesarias.

---

## ▶️ INICIAR LA APLICACIÓN

Necesitas **2 terminales abiertas**:

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Deberías ver:
```
Server running on port 3000
```

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

Deberías ver:
```
  ➜  Local:   http://localhost:5173/
```

---

## 🧪 PRUEBAS PASO A PASO

### ✅ Prueba 1: Registro de Usuario Creator

1. Abre tu navegador en: **http://localhost:5173**
2. Serás redirigido a `/login`
3. Haz clic en **"start your 14-day free trial"**
4. Llena el formulario:
   - **Name**: Tu Nombre Completo
   - **Email**: creator@test.com
   - **Password**: password123
   - **I am a**: Selecciona **"Creator"**
5. Haz clic en **"Sign up"**
6. ✅ Deberías ver el Dashboard con el botón "Create New Course"

---

### ✅ Prueba 2: Generar Curso con IA

1. En el Dashboard, haz clic en **"Create New Course"**
2. Ingresa un tema, por ejemplo:
   ```
   Introduction to Machine Learning
   ```
3. Haz clic en **"Generate Curriculum"**
4. ⏳ Espera ~10-15 segundos mientras la IA trabaja
5. ✅ Deberías ver:
   - Título del curso generado
   - Descripción
   - Varios módulos (ej: "Basics", "Supervised Learning", etc.)
   - Lecciones dentro de cada módulo
6. Haz clic en **"Save Course"**
7. ✅ Vuelves al Dashboard

---

### ✅ Prueba 3: Ver el Curso (Manual)

Por ahora, necesitas ir manualmente a la URL del curso:

1. Abre las **DevTools** del navegador (F12)
2. Ve a la pestaña **"Network"**
3. Filtra por "save"
4. Busca la respuesta del POST a `/api/courses/save`
5. Copia el **ID** del curso (algo como `"id": "abc123..."`)
6. Ve manualmente a:
   ```
   http://localhost:5173/course/[PEGA_EL_ID_AQUÍ]
   ```

✅ Deberías ver:
- Sidebar izquierdo con módulos y lecciones
- Contenido de la primera lección en el centro
- Chat del AI Tutor a la derecha

---

### ✅ Prueba 4: Chatear con el AI Tutor

1. En la vista del curso, ve al **chat widget** (lado derecho)
2. Escribe una pregunta relacionada con el curso, por ejemplo:
   ```
   What is supervised learning?
   ```
3. Presiona Enter o haz clic en el icono de enviar
4. ⏳ Espera ~5 segundos
5. ✅ El AI Tutor debería responder con información **basada en el contenido del curso**

**Pregunta de prueba adicional:**
```
Can you explain the difference between classification and regression?
```

---

### ✅ Prueba 5: Login como Estudiante

1. Haz clic en **"Logout"** en el Dashboard
2. Ve a `/register` otra vez
3. Crea otra cuenta:
   - **Email**: student@test.com
   - **Password**: password123
   - **I am a**: Selecciona **"Student"**
4. ✅ Deberías ver un Dashboard SIN el botón "Create New Course"

---

## 🐛 PROBLEMAS COMUNES

### ❌ "Failed to generate course structure"
**Solución:**
- Verifica que `GEMINI_API_KEY` esté correctamente configurada en `server/.env`
- Abre las DevTools (F12) → Console para ver el error exacto
- Verifica que el servidor backend esté corriendo

### ❌ "Prisma Client validation error"
**Solución:**
```bash
cd server
npx prisma generate
npx prisma migrate dev
```

### ❌ "Cannot connect to database"
**Solución:**
- Verifica que PostgreSQL esté corriendo
- Verifica que `DATABASE_URL` en `.env` sea correcta
- Si usas Neon, verifica que la connection string sea la correcta

### ❌ "Port 3000 is already in use"
**Solución 1:**
- Encuentra y mata el proceso usando el puerto 3000

**Solución 2:**
- Cambia `PORT=3001` en `server/.env`
- Actualiza todas las URLs en `client/src/` de `localhost:3000` a `localhost:3001`

---

## 📊 CHECKLIST ANTES DE FASE 3

Marca con [x] cuando completes cada prueba:

- [ ] Puedo registrarme como CREATOR
- [ ] Puedo generar un curso con IA (y veo módulos/lecciones)
- [ ] El curso se guarda correctamente
- [ ] Puedo ver la vista del curso
- [ ] El AI Tutor responde mis preguntas
- [ ] Las respuestas del tutor son coherentes con el contenido
- [ ] Puedo crear una cuenta de STUDENT
- [ ] Login/Logout funciona correctamente

---

## 🎉 ¿TODO FUNCIONA?

Si todas las pruebas pasaron, ¡estás listo para la **Fase 3**!

La Fase 3 incluirá:
- 🤖 Agente de Optimización (analiza preguntas frecuentes)
- 📊 Dashboard de Analytics para Creadores
- 🔌 API REST pública
- 📱 Endpoints para integraciones externas

---

## 📞 AYUDA

Si encuentras problemas:
1. Revisa la **consola del navegador** (F12 → Console)
2. Revisa los **logs del servidor** (terminal del backend)
3. Verifica que todos los archivos `.env` estén correctos
4. Asegúrate de haber ejecutado `npx prisma migrate dev`

¡Suerte! 🚀
