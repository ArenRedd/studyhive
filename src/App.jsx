import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { SubjectProvider, useSubject } from '@/context/SubjectContext';

import LoginPage from '@/pages/LoginPage';
import BookshelfPage from '@/pages/BookshelfPage';
import Shell from '@/components/Shell';
import Dashboard from '@/pages/Dashboard';
import ExamReadiness from '@/pages/ExamReadiness';
import PlaceholderPage from '@/pages/PlaceholderPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function DashboardRedirect() {
  const { currentSubject } = useSubject();
  return <Navigate to={`/dashboard/${currentSubject?.code || 'CS3691'}`} replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root Route: If logged in -> Bookshelf, else -> Login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/subjects" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login Route: Signal login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Bookshelf Route: Subject chooser */}
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <BookshelfPage />
          </ProtectedRoute>
        }
      />

      {/* StudyHive Dashboard Route (Reusable for any subjectId) */}
      <Route
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/dashboard/:subjectId" element={<Dashboard />} />
        <Route
          path="/quiz-mode"
          element={
            <PlaceholderPage
              title="Quiz Mode"
              description="Timed practice runs over a whole unit are being prepared. For now use the Practice Quiz tab inside any unit panel."
            />
          }
        />
        <Route
          path="/question-hive"
          element={
            <PlaceholderPage
              title="Question Hive"
              description="Every question from all five units in one honeycomb, ready to filter by unit, marks and revision status."
            />
          }
        />
        <Route
          path="/unit-nests"
          element={
            <PlaceholderPage
              title="Unit Nests"
              description="A closer look at each nest: question counts, readiness and marks distribution."
            />
          }
        />
        <Route
          path="/revision"
          element={
            <PlaceholderPage
              title="Revision"
              description="Your starred questions, collected for one focused revision session."
            />
          }
        />
        <Route
          path="/notes"
          element={
            <PlaceholderPage
              title="Notes"
              description="Pin short notes, formulas and diagrams to each unit so they sit beside your checklist."
            />
          }
        />
        <Route
          path="/resources"
          element={
            <PlaceholderPage
              title="Resources"
              description="Reference links, datasheets and previous papers for the course."
            />
          }
        />
        <Route path="/exam-readiness" element={<ExamReadiness />} />
      </Route>

      {/* Catch-all fallback */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/subjects" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubjectProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SubjectProvider>
    </AuthProvider>
  );
}
