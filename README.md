# KourseOS
**El Sistema Operativo para la Nueva Era de la Educación**

Crea tu contenido, gestiona tus afiliados y automatiza tu marketing en un solo motor de IA inteligente.

---

## 🎨 Identidad Visual

### Paleta de Colores (Estricta)
- **Fondo General:** `#0B0F1A` (Deep Space)
- **Cards y Superficies:** `#161B2B`
- **Primario (Botones/Links):** `#3B82F6`
- **Acento Exclusivo:** `#F59E0B` (Solo para el Badge de 'Founder Edition')
- **Texto:** `#F9FAFB`

### Tipografía
- **Fuente Principal:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700, 800

---

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
El proyecto estará disponible en `http://localhost:5173`

### Build de Producción
```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
kourseos/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── Sidebar.tsx
│   ├── pages/           # Vistas principales
│   │   └── Dashboard.tsx
│   ├── layouts/         # Layouts del sistema
│   ├── lib/             # Configuraciones (Supabase, etc.)
│   │   └── supabase.ts
│   ├── hooks/           # Custom React Hooks
│   ├── App.tsx          # Componente raíz
│   ├── main.tsx         # Entry point
│   └── index.css        # Design System & Tailwind
├── database.sql         # Esquema SQL completo
├── tailwind.config.js   # Tokens de diseño
├── postcss.config.js    # PostCSS config
└── vite.config.ts       # Vite config
```

---

## 🗄️ Base de Datos

### Tablas Principales

#### `profiles`
Gestión de usuarios y creadores.
- Soporte para organizaciones
- Roles: `super_admin`, `creator`, `student`

#### `courses`
Productos educativos.
- Metadatos avanzados para Marketing y Afiliados
- Estados: `draft`, `published`, `archived`, `review`

#### `lessons`
Unidades educativas con soporte para Nano Learning.
- **Tipos:** `text`, `video`, `audio`, `quiz`
- **Nano Learning:** `nano_summary`, `action_item`, `key_concept`
- **Audio Gratuito:** Campo `audio_url` para estrategia de marketing

### Ejecutar Schema
```sql
-- Ejecutar en tu base de datos Supabase
psql -f database.sql
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GROQ_API_KEY=tu_groq_api_key
```

### Obtener API Keys

#### Supabase
1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la `URL` y la `anon/public key`
5. Ejecuta el archivo `database.sql` en el SQL Editor de Supabase

#### Groq
1. Crea una cuenta en [Groq Cloud](https://console.groq.com)
2. Ve a API Keys
3. Crea una nueva API key
4. Cópiala al archivo `.env`

---

## 🧠 Generador de Nano Learning

El sistema permite generar cursos completos divididos en "átomos de conocimiento" usando IA.

### Cómo Funciona

1. **Input:** El usuario ingresa un tema (ej: "Marketing Digital para Creadores")
2. **IA (Groq):** Genera lecciones estructuradas en formato Markdown
3. **Persistencia:** Cada lección se guarda automáticamente en Supabase
4. **Audio Gratuito:** Web Speech API permite escuchar cada lección

### Estructura de una Lección

Cada "átomo de conocimiento" contiene:
- **Concepto Clave:** Una sola idea central (máx. 10 palabras)
- **Explicación:** Contenido en Markdown con negritas, listas y código
- **Acción Inmediata:** Tarea concreta para aplicar el conocimiento

### Features Implementadas

- ✅ Generación con Groq (Mixtral-8x7b)
- ✅ Persistencia en Supabase
- ✅ Web Speech API (Play/Pause)
- ✅ Skeleton Loading States
- ✅ Renderizado de Markdown
- ✅ Animaciones con Framer Motion

---

## ✨ Características Actuales

- ✅ **Dashboard Enterprise:** Diseño limpio con glassmorphism
- ✅ **Sistema de Colores:** Deep Space aesthetic
- ✅ **Gestión de Cursos:** Vista de infraestructura completa
- ✅ **Marketing AI Insights:** Recomendaciones inteligentes
- ✅ **Founder Edition Badge:** Identidad premium

---

## 🔜 Próximas Funcionalidades

1. **Generador de Nano Learning con IA**
   - División de contenido en átomos de conocimiento
   - Web Speech API para audio gratuito
   - UI tipo Cards limpia

2. **Sistema de Afiliados**
   - Panel de tracking avanzado
   - Comisiones automáticas

3. **Automatización de Marketing**
   - Embudos inteligentes
   - Análisis predictivo

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3.4
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Backend:** Supabase (PostgreSQL)
- **AI Integration:** TBD (OpenAI / Gemini)

---

## 📄 Licencia

Propietario - KourseOS © 2026

---

**KourseOS** - Infraestructura para Creadores de Cursos
