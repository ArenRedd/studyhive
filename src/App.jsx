import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Shell from '@/components/Shell';
import Dashboard from '@/pages/Dashboard';
import ExamReadiness from '@/pages/ExamReadiness';
import PlaceholderPage from '@/pages/PlaceholderPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Dashboard />} />
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
              description="A closer look at each nest: question counts, readiness and marks distribution for CS3691."
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
              description="Reference links, datasheets and previous papers for the Embedded Systems & IoT course."
            />
          }
        />
        <Route path="/exam-readiness" element={<ExamReadiness />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App