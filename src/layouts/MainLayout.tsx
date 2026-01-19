import React from 'react';
import { Sidebar } from '../components/Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text">
            <Sidebar />
            <div className="pl-72 w-full">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
