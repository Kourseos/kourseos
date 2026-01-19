# Guía de Uso: Generador de Nano Learning

## 📚 Introducción

El **Generador de Nano Learning** es la característica principal de KourseOS que te permite crear cursos educativos completos divididos en "átomos de conocimiento" usando IA. Cada lección está diseñada para ser consumida en 60-90 segundos e incluye audio gratuito como estrategia de marketing.

---

## 🎯 Características Principales

### 1. Generación con IA (Groq)
- Utiliza el modelo **Mixtral-8x7b** para generar contenido educativo de alta calidad
- El prompt está optimizado para crear lecciones progresivas y accionables
- Genera contenido en formato **Markdown** con negritas, listas y bloques de código

### 2. Estructura de Lección (Átomo de Conocimiento)
Cada lección generada contiene exactamente estos elementos:

```
📌 Concepto Clave
   Una sola idea central (máximo 10 palabras)

📝 Explicación (Markdown)
   Contenido detallado con:
   - Negritas para énfasis (**texto**)
   - Listas ordenadas y no ordenadas
   - Bloques de código cuando aplique

⚡ Acción Inmediata
   Tarea concreta para aplicar el conocimiento HOY
```

### 3. Persistencia en Supabase
- Cada curso se guarda automáticamente en la tabla `courses`
- Las lecciones se vinculan mediante `course_id`
- Los campos de Nano Learning (`key_concept`, `action_item`, `nano_summary`) se mapean correctamente

### 4. Web Speech API (Audio Gratuito)
- **Botón Play/Pause** en cada lección
- El sistema limpia automáticamente el Markdown para el TTS (Text-to-Speech)
- Velocidad optimizada: `0.9x` para mejor comprensión
- Idioma: `es-ES` (Español)
- **Indicador visual** de progreso mientras se reproduce

---

## 🚀 Cómo Usar

### Paso 1: Configurar Variables de Entorno
Asegúrate de tener un archivo `.env` con tus API keys:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GROQ_API_KEY=tu_groq_api_key
```

### Paso 2: Ejecutar la Base de Datos
Ejecuta el archivo `database.sql` en tu proyecto de Supabase para crear las tablas necesarias.

### Paso 3: Iniciar el Generador
1. Abre KourseOS en tu navegador (`http://localhost:5173`)
2. Verás el **Generador de Nano Learning**

### Paso 4: Crear tu Curso
1. **Ingresa el Tema:**
   - Ejemplo: "Marketing Digital para Creadores de Contenido"
   - Ejemplo: "Python para Data Science"
   - Ejemplo: "Storytelling para Emprendedores"

2. **Selecciona el Número de Lecciones:**
   - 3 lecciones (curso corto)
   - 5 lecciones (curso estándar)
   - 7 lecciones (curso avanzado)
   - 10 lecciones (curso completo)

3. **Haz clic en "Generar Curso con IA"**

### Paso 5: Esperar la Generación
Verás una pantalla de carga con el mensaje:
```
🔄 Sintetizando lecciones inteligentes...
```

El sistema mostrará **Skeleton Cards** animadas mientras la IA genera el contenido.

### Paso 6: Explorar las Lecciones
Una vez generado:
- Cada lección aparece como una **Card limpia**
- El **Concepto Clave** está resaltado en un badge dorado
- La **Explicación** se renderiza con formato Markdown
- La **Acción Inmediata** está al final de cada card

### Paso 7: Escuchar el Audio
1. Haz clic en el botón **"Escuchar"** (icono de volumen)
2. El botón cambiará a **"Pausar"** mientras se reproduce
3. Una barra de progreso azul aparecerá en la parte inferior de la card
4. Puedes pausar y reanudar la reproducción en cualquier momento

---

## 🎨 Detalles de Diseño

### Paleta de Colores
- **Concepto Clave:** Badge dorado `#F59E0B` (acento exclusivo)
- **Botón de Audio:** Azul primario `#3B82F6`
- **Acción Inmediata:** Verde esmeralda `#10B981`
- **Background:** Deep Space `#0B0F1A`

### Animaciones
- **Entrada de Cards:** Fade-in con stagger (0.1s entre cada una)
- **Hover en Cards:** Glow sutil con gradiente azul
- **Barra de Progreso de Audio:** Animación lineal de 90 segundos

---

## 🛠️ Aspectos Técnicos

### Prompt del Sistema (Groq)
El prompt está diseñado para:
- Crear lecciones **progresivas** (cada una construye sobre la anterior)
- Generar contenido **accionable** (no solo teórico)
- Usar formato **Markdown profesional**
- Mantener la brevedad (60-90 segundos de lectura)

### Limpieza de Texto para TTS
El hook `useSpeechSynthesis` limpia el Markdown antes de enviarlo al Web Speech API:
```typescript
// Elimina caracteres de Markdown
.replace(/[*_~`#]/g, '')
// Convierte links a solo texto
.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
// Elimina bloques de código
.replace(/```[\s\S]*?```/g, '')
// Convierte saltos de línea en pausas
.replace(/\n+/g, '. ')
```

### Persistencia en Supabase
Mapeo de campos:
```typescript
{
  title: lesson.title,
  content: lesson.explanation,      // Markdown
  key_concept: lesson.concept,
  action_item: lesson.action,
  nano_summary: lesson.concept,
  is_free: true,                     // Estrategia de audio gratuito
  duration_seconds: 90               // Estimación
}
```

---

## 💡 Tips y Buenas Prácticas

### Para Generar Mejores Cursos:
1. **Sé específico con el tema:**
   - ❌ "Marketing"
   - ✅ "Marketing en Instagram para Coaches de Negocios"

2. **Considera el nivel de tu audiencia:**
   - Principiantes: 5-7 lecciones
   - Intermedios: 7-10 lecciones
   - Avanzados: 10+ lecciones

3. **Revisa el contenido generado:**
   - La IA es muy buena, pero siempre revisa
   - Puedes editar las lecciones directamente en Supabase

### Para Maximizar el Alcance:
1. **Usa el audio gratuito como gancho:**
   - Todos los audios son gratis por defecto
   - Esto atrae prospectos antes de vender el curso completo

2. **Comparte lecciones individuales:**
   - Cada lección es un átomo independiente
   - Puedes compartirlas en redes sociales

---

## 🔧 Solución de Problemas

### "No se pudieron generar las lecciones"
- ✅ Verifica que tu `VITE_GROQ_API_KEY` esté configurada
- ✅ Asegúrate de tener créditos en tu cuenta de Groq
- ✅ Revisa la consola del navegador para errores específicos

### "No se pudieron guardar las lecciones"
- ✅ Verifica tu `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- ✅ Asegúrate de haber ejecutado `database.sql` en Supabase
- ✅ Verifica que las tablas `courses` y `lessons` existan

### El audio no funciona
- ✅ Verifica que estés usando un navegador compatible (Chrome, Edge, Safari)
- ✅ Asegúrate de que el volumen del sistema esté activado
- ✅ Algunos navegadores requieren que el usuario haga clic antes de usar Web Speech API

---

## 📊 Próximas Mejoras

- [ ] Sistema de autenticación de usuarios
- [ ] Editor de lecciones en tiempo real
- [ ] Exportación a PDF/DOCX
- [ ] Traducción automática a otros idiomas
- [ ] Métricas de engagement por lección
- [ ] Integración con sistema de afiliados

---

¿Necesitas ayuda? Abre un issue en el repositorio o consulta la documentación de KourseOS.
