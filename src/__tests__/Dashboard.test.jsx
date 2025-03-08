import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' }
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

// Create a wrapper component that provides necessary context
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      retryDelay: 0
    },
  },
});

const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe('Dashboard Component', () => {
  beforeEach(() => {
    queryClient.clear();
    axios.get.mockReset();
  });

  test('shows loading state initially', async () => {
    // Mock the API call but don't resolve it yet
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    customRender(<Dashboard />);
    expect(screen.getByText(/loading tournaments/i)).toBeInTheDocument();
  });

  test('displays tournaments when data is loaded', async () => {
    // Mock successful API response
    const mockTournaments = {
      data: {
        results: [
          {
            id: 1,
            name: 'Test Tournament 1',
            status: 'active',
            tournament_type: 'individual',
            venue: 'Test Venue',
            start_date: '2024-03-07',
            end_date: '2024-03-14'
          },
          {
            id: 2,
            name: 'Test Tournament 2',
            status: 'draft',
            tournament_type: 'team',
            venue: 'Test Venue 2',
            start_date: '2024-03-15',
            end_date: '2024-03-22'
          }
        ]
      }
    };

    axios.get.mockResolvedValueOnce(mockTournaments);
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Test Tournament 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tournament 2')).toBeInTheDocument();
    });

    expect(screen.getByText(/Type: individual/)).toBeInTheDocument();
    expect(screen.getByText(/Type: team/)).toBeInTheDocument();
    expect(screen.getByText(/Venue: Test Venue$/)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch tournaments';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    customRender(<Dashboard />);

    // First, verify loading state
    expect(screen.getByText(/loading tournaments/i)).toBeInTheDocument();

    // Then, wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/error loading tournaments/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays empty state when no tournaments exist', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no tournaments found/i)).toBeInTheDocument();
      expect(screen.getByText(/create a new tournament/i)).toBeInTheDocument();
    });
  });

  test('displays "View All Tournaments" button', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/view all tournaments/i)).toBeInTheDocument();
    });
  });

  test('handles malformed API response gracefully', async () => {
    axios.get.mockResolvedValueOnce({ data: 'invalid data' });
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no tournaments found/i)).toBeInTheDocument();
    });
  });
}); 