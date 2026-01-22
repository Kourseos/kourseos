import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CourseCreator from './pages/CourseCreator';
import CourseView from './pages/CourseView';
import QuizRoom from './pages/QuizRoom';
import Certificate from './pages/Certificate';
import ExplorerCertificates from './pages/ExplorerCertificates';
import DevelopersPage from './pages/DevelopersPage';
import CourseLanding from './pages/CourseLanding';
import PaymentSuccess from './pages/PaymentSuccess';
import AffiliateDashboard from './pages/AffiliateDashboard';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <CoursesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <PrivateRoute>
                <CourseCreator />
              </PrivateRoute>
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <PrivateRoute>
                <CourseView />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <PrivateRoute>
                <QuizRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/course/:courseId/certificate"
            element={
              <PrivateRoute>
                <Certificate />
              </PrivateRoute>
            }
          />
          <Route
            path="/explorer/certificates"
            element={
              <PrivateRoute>
                <ExplorerCertificates />
              </PrivateRoute>
            }
          />
          <Route
            path="/developers"
            element={
              <PrivateRoute>
                <DevelopersPage />
              </PrivateRoute>
            }
          />
          <Route path="/landing/:courseId" element={<CourseLanding />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route
            path="/affiliates"
            element={
              <PrivateRoute>
                <AffiliateDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <WalletPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
