import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();

  const { data: tournamentsData, isLoading, error } = useQuery(
    'tournaments',
    async () => {
      try {
        console.log('Fetching tournaments with auth token...');
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/tournaments/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log('API Response:', {
          status: response.status,
          data: response.data
        });

        // Ensure we have an array of tournaments
        const tournaments = Array.isArray(response.data) ? response.data :
                          Array.isArray(response.data?.results) ? response.data.results :
                          [];

        console.log('Processed tournaments:', tournaments);
        return tournaments;

      } catch (err) {
        console.error('Error fetching tournaments:', err);
        if (err.response) {
          console.error('Error details:', {
            status: err.response.status,
            data: err.response.data
          });
        }
        throw err;
      }
    },
    {
      enabled: !!user, // Only run query if user is logged in
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading tournaments...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">Error loading tournaments</h2>
          <p>{error.message}</p>
          {error.response?.data && (
            <pre className="mt-2 text-sm">
              {JSON.stringify(error.response.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  const tournaments = Array.isArray(tournamentsData) ? tournamentsData : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link
          to="/tournaments"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View All Tournaments
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {tournaments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tournaments found. Create your first tournament!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tournaments.map((tournament) => (
              <li key={tournament.id || Math.random()}>
                <Link
                  to={`/tournaments/${tournament.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {tournament.name || 'Unnamed Tournament'}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tournament.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {tournament.status || 'unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {tournament.tournament_type || 'No type'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {tournament.venue || 'No venue'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'No date'} -{' '}
                          {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;