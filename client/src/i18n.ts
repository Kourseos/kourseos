import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "courses": "Courses",
                "pricing": "Pricing",
                "developers": "Developers",
                "login": "Login",
                "register": "Get Started"
            },
            "hero": {
                "badge": "NEW: GEMINI 2.0 FLASH INTEGRATION",
                "title": "Build Mastery with",
                "subtitle": "The Future of AI-Powered Education",
                "description": "Craft high-impact courses in seconds focusing on what matters. SkillForge AI uses state-of-the-art models to generate, optimize, and scale your knowledge.",
                "cta_primary": "Create Course Now",
                "cta_secondary": "Explore Certificates"
            },
            "dashboard": {
                "welcome": "Hello",
                "summary": "Here is a summary of your activity today.",
                "active_courses": "Active Courses",
                "students": "Students",
                "completion": "Completion",
                "certificates": "Certificates",
                "create_new": "Create New Course",
                "recent_courses": "Recent Courses",
                "view_all": "View all",
                "no_courses": "No active courses",
                "no_courses_desc": "Start by creating your first course with AI and share your knowledge with the world."
            }
        }
    },
    es: {
        translation: {
            "nav": {
                "home": "Inicio",
                "courses": "Cursos",
                "pricing": "Precios",
                "developers": "Desarrolladores",
                "login": "Iniciar Sesión",
                "register": "Comenzar"
            },
            "hero": {
                "badge": "NUEVO: INTEGRACIÓN GEMINI 2.0 FLASH",
                "title": "Domina el Futuro con",
                "subtitle": "La Educación Impulsada por IA",
                "description": "Crea cursos de alto impacto en segundos. SkillForge AI utiliza modelos de última generación para generar, optimizar y escalar tu conocimiento.",
                "cta_primary": "Crear Curso Ahora",
                "cta_secondary": "Explorar Certificados"
            },
            "dashboard": {
                "welcome": "Hola",
                "summary": "Aquí tienes un resumen de tu actividad hoy.",
                "active_courses": "Cursos Activos",
                "students": "Estudiantes",
                "completion": "Completación",
                "certificates": "Certificados",
                "create_new": "Crear Nuevo Curso",
                "recent_courses": "Cursos Recientes",
                "view_all": "Ver todos",
                "no_courses": "No hay cursos activos",
                "no_courses_desc": "Comienza creando tu primer curso con IA y comparte tu conocimiento con el mundo."
            }
        }
    },
    pt: {
        translation: {
            "nav": {
                "home": "Início",
                "courses": "Cursos",
                "pricing": "Preços",
                "developers": "Desenvolvedores",
                "login": "Entrar",
                "register": "Começar"
            },
            "hero": {
                "badge": "NOVO: INTEGRAÇÃO GEMINI 2.0 FLASH",
                "title": "Domine o Futuro com",
                "subtitle": "Educação Impulsionada por IA",
                "description": "Crie cursos de alto impacto em segundos. SkillForge AI usa modelos de última geração para gerar, otimizar e escalar seu conhecimento.",
                "cta_primary": "Criar Curso Agora",
                "cta_secondary": "Explorar Certificados"
            }
        }
    },
    it: {
        translation: {
            "nav": {
                "home": "Home",
                "courses": "Corsi",
                "pricing": "Prezzi",
                "developers": "Sviluppatori",
                "login": "Accedi",
                "register": "Inizia"
            },
            "hero": {
                "badge": "NUOVO: INTEGRAZIONE GEMINI 2.0 FLASH",
                "title": "Domina il Futuro con",
                "subtitle": "L'Educazione basata su IA",
                "description": "Crea corsi ad alto impatto in pochi secondi. SkillForge AI utilizza modelli all'avanguardia per generare, ottimizzare e scalare la tua conoscenza.",
                "cta_primary": "Crea Corso Ora",
                "cta_secondary": "Esplora Certificati"
            }
        }
    },
    zh: {
        translation: {
            "nav": {
                "home": "首页",
                "courses": "课程",
                "pricing": "价格",
                "developers": "开发者",
                "login": "登录",
                "register": "开始使用"
            },
            "hero": {
                "badge": "新功能：GEMINI 2.0 FLASH 集成",
                "title": "掌控未来",
                "subtitle": "AI 驱动的教育",
                "description": "在几秒钟内制作高影响力的课程。SkillForge AI 使用最先进的模型来生成、优化和扩展您的知识。",
                "cta_primary": "立即创建课程",
                "cta_secondary": "探索证书"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;
