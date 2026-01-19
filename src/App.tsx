import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NanoLearningGenerator from './pages/NanoLearningGenerator';
import AffiliatesPage from './pages/AffiliatesPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes (wrapped in MainLayout) */}
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/generator" element={<MainLayout><NanoLearningGenerator /></MainLayout>} />
        <Route path="/affiliates" element={<MainLayout><AffiliatesPage /></MainLayout>} />

        {/* Placeholder routes */}
        <Route path="/courses" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/marketing" element={<MainLayout><AffiliatesPage /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/audio" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Dashboard /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
