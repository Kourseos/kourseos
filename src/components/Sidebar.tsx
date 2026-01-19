import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    BarChart3,
    Radio,
    Mic2,
    CreditCard,
    Target,
    Sparkles,
    LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Sparkles, label: 'Nano Generator', path: '/generator' },
    { icon: BookOpen, label: 'Mis Cursos', path: '/courses' },
    { icon: Target, label: 'Marketing', path: '/marketing' },
    { icon: Users, label: 'Afiliados', path: '/affiliates' },
    { icon: BarChart3, label: 'Analíticas', path: '/analytics' },
    { icon: Mic2, label: 'Voz & Audio', path: '/audio' },
    { icon: Radio, label: 'Live Sessions', path: '/live' },
    { icon: CreditCard, label: 'Suscripciones', path: '/subscriptions' },
];

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-72 glass border-r border-white/10 p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <BookOpen className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text">KourseOS</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold leading-none">Creator Infrastructure</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={location.pathname === item.path ? 'nav-link-active' : 'nav-link'}
                    >
                        <item.icon size={18} />
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                ))}

                <div className="pt-6 mt-6 border-t border-white/5 space-y-1">
                    <Link to="/settings" className={location.pathname === '/settings' ? 'nav-link-active' : 'nav-link'}>
                        <Settings size={18} />
                        <span className="font-medium text-sm">Configuración</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full nav-link text-red-400/70 hover:text-red-400 hover:bg-red-500/5 text-left"
                    >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="bg-gradient-to-br from-primary/20 to-transparent p-4 rounded-2xl border border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Plan Pro</p>
                        <span className="badge-founder scale-75 origin-right">Founder</span>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs text-gray-400">1.2 GB / 50 GB</span>
                        <span className="text-xs text-text font-medium">2%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                        <div className="h-full w-[2%] bg-primary rounded-full" />
                    </div>
                </div>
            </div>
        </aside>
    );
};
