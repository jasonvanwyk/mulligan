import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock AuthContext
const mockLogin = jest.fn();
let mockLoading = false;
let mockError = null;

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: mockLoading,
    error: mockError
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

// Create a wrapper component that provides necessary context
const queryClient = new QueryClient();

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

describe('Login Component', () => {
  beforeEach(() => {
    queryClient.clear();
    mockNavigate.mockClear();
    mockLogin.mockReset();
    mockLoading = false;
    mockError = null;
  });

  test('renders login form', () => {
    customRender(<Login />);
    
    expect(screen.getByText('Sign in to Mulligan')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows error message on invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    mockError = 'Invalid username or password';
    
    customRender(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  test('redirects to dashboard on successful login', async () => {
    mockLogin.mockResolvedValueOnce({ username: 'testuser' });
    
    customRender(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows loading state while authenticating', async () => {
    mockLoading = true;
    
    customRender(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  test('prevents form submission with empty fields', () => {
    customRender(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
}); 