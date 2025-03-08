import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Create a wrapper component that provides necessary context
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
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
    // Clear localStorage and reset mocks before each test
    localStorage.clear();
    queryClient.clear();
    axios.get.mockReset();
  });

  test('shows loading state initially', () => {
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

    // Wait for tournaments to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Tournament 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tournament 2')).toBeInTheDocument();
    });

    // Check if tournament details are displayed
    expect(screen.getByText('individual')).toBeInTheDocument();
    expect(screen.getByText('team')).toBeInTheDocument();
    expect(screen.getAllByText('Test Venue')[0]).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock API error
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch tournaments'));
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/error loading tournaments/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no tournaments exist', async () => {
    // Mock empty tournaments list
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no tournaments found/i)).toBeInTheDocument();
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
    // Mock malformed API response
    axios.get.mockResolvedValueOnce({ data: 'invalid data' });
    
    customRender(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no tournaments found/i)).toBeInTheDocument();
    });
  });
}); 