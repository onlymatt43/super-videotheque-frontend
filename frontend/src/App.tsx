import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPage } from './pages/RefundPage';
import { AdultNoticePage } from './pages/AdultNoticePage';
import { CompliancePage } from './pages/CompliancePage';
import { AdminPage } from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { DMCAPage } from './pages/DMCAPage';
import { AMLPage } from './pages/AMLPage';
import { Layout } from './components/Layout';
import { useSession } from './features/session/useSession';
import { useHideCursor } from './hooks/useHideCursor';
import { hasAdminSessionToken } from './api/client';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { getActiveAccess } = useSession();
  const hasAccess = getActiveAccess().length > 0;
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = hasAdminSessionToken();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  useHideCursor();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/adult-notice" element={<AdultNoticePage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/dmca" element={<DMCAPage />} />
        <Route path="/aml" element={<AMLPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
