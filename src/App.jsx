import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import TournamentList from './pages/TournamentList';
import TournamentDetail from './pages/TournamentDetail';
import TournamentResults from './pages/TournamentResults';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tournaments"
                  element={
                    <PrivateRoute>
                      <TournamentList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tournaments/:id"
                  element={
                    <PrivateRoute>
                      <TournamentDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tournaments/:id/results"
                  element={
                    <PrivateRoute>
                      <TournamentResults />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
