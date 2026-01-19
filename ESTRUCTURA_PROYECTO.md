# 📁 Estructura del Proyecto KourseOS

```
kourseos/
│
├── 📄 .env.example                    # Template de configuración (COPIAR A .env)
├── 📄 .gitignore                      # Protección de variables de entorno
├── 📄 README.md                       # Guía general del proyecto
├── 📄 IMPLEMENTACION_COMPLETA.md      # Resumen ejecutivo de la implementación
├── 📄 GUIA_NANO_LEARNING.md           # Manual detallado del generador
├── 📄 example_lessons.json            # Ejemplo de output de Groq
│
├── 🗄️ database.sql                    # Schema completo de Supabase
│
├── ⚙️ package.json                    # Dependencias y scripts
├── ⚙️ tailwind.config.js              # Paleta de colores KourseOS
├── ⚙️ postcss.config.js               # Config de PostCSS
├── ⚙️ vite.config.ts                  # Config de Vite
├── ⚙️ tsconfig.json                   # Config de TypeScript
│
├── 📂 src/
│   ├── 📄 App.tsx                     # Entry point de la aplicación
│   ├── 📄 main.tsx                    # Montaje de React
│   ├── 📄 index.css                   # Design System global
│   │
│   ├── 📂 components/
│   │   ├── Sidebar.tsx                # Navegación lateral con branding
│   │   ├── LessonCard.tsx             # Card de lección con audio
│   │   └── LoadingState.tsx           # Skeleton screens animados
│   │
│   ├── 📂 pages/
│   │   ├── Dashboard.tsx              # Vista principal (Enterprise SaaS)
│   │   └── NanoLearningGenerator.tsx  # Generador de cursos IA
│   │
│   ├── 📂 lib/
│   │   ├── supabase.ts                # Cliente Supabase
│   │   ├── groq.ts                    # Servicio de IA (Mixtral-8x7b)
│   │   └── database.ts                # CRUD de cursos y lecciones
│   │
│   └── 📂 hooks/
│       └── useSpeechSynthesis.ts      # Web Speech API wrapper
│
└── 📂 node_modules/                   # Dependencias (auto-generado)
```

## 📦 Archivos Clave

### Documentación
- **README.md** → Vista general del proyecto
- **IMPLEMENTACION_COMPLETA.md** → Resumen técnico completo
- **GUIA_NANO_LEARNING.md** → Manual de usuario del generador
- **example_lessons.json** → Ejemplo de lecciones generadas por IA

### Configuración
- **.env.example** → Template para variables de entorno
- **database.sql** → Schema de Supabase (ejecutar una vez)
- **tailwind.config.js** → Paleta Deep Space (#0B0F1A, #3B82F6, #F59E0B)

### Código Fuente
- **src/pages/NanoLearningGenerator.tsx** → Interfaz principal del generador
- **src/components/LessonCard.tsx** → Renderiza cada átomo de conocimiento
- **src/lib/groq.ts** → Comunicación con IA para generar lecciones
- **src/lib/database.ts** → Persistencia en Supabase
- **src/hooks/useSpeechSynthesis.ts** → Control de audio

## 🎨 Paleta de Colores (Definida en `tailwind.config.js`)

```javascript
background: {
  DEFAULT: '#0B0F1A',  // Deep Space
  surface: '#161B2B',  // Cards
}
primary: '#3B82F6',    // Azul primario (botones, links)
accent: '#F59E0B',     // Ámbar (solo badges Founder)
text: '#F9FAFB',       // Texto principal
```

## 🚀 Scripts Disponibles

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo (http://localhost:5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter de TypeScript
```

## 🔗 Dependencias Principales

| Paquete | Propósito |
|---------|-----------|
| `groq-sdk` | Generación de contenido con IA |
| `@supabase/supabase-js` | Base de datos y persistencia |
| `markdown-to-jsx` | Renderizado de Markdown |
| `framer-motion` | Animaciones fluidas |
| `lucide-react` | Iconos modernos |
| `tailwindcss` | Sistema de diseño |

## 📊 Flujo de Datos

```
Usuario ingresa tema
       ↓
NanoLearningGenerator.tsx (UI)
       ↓
groq.ts (generateNanoLessons)
       ↓
Groq API (Mixtral-8x7b)
       ↓
database.ts (createCourse + saveLessonsToDatabase)
       ↓
Supabase (PostgreSQL)
       ↓
LessonCard.tsx (Renderiza + Audio)
       ↓
useSpeechSynthesis.ts (Web Speech API)
```

## 🔐 Seguridad

- **Variables de entorno:** `.env` está en `.gitignore`
- **API Keys:** Nunca se exponen en el código fuente
- **Supabase RLS:** Habilitar en producción para Row Level Security

## 📝 Próximos Pasos

1. **Configurar `.env`** con tus credenciales
2. **Ejecutar `database.sql`** en Supabase
3. **Ejecutar `npm run dev`**
4. **Generar tu primer curso** con el Nano Learning Generator

---

**Total de archivos creados:** 20+
**Líneas de código:** ~2,500
**Tiempo de implementación:** Completo ✅
