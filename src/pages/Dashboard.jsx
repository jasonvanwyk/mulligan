import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: tournaments, isLoading, error } = useQuery(
    'tournaments',
    async () => {
      const response = await axios.get('/api/tournaments/');
      return response.data;
    },
    {
      enabled: !!user,
      retry: 1,
      refetchOnWindowFocus: false
    }
  );

  if (isLoading) {
    return <div>Loading tournaments...</div>;
  }

  if (error) {
    return <div>Error loading tournaments: {error.message}</div>;
  }

  if (!tournaments?.results?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">No tournaments found</h2>
        <p className="mt-2 text-gray-600">Create a new tournament to get started.</p>
        <Link
          to="/tournaments"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          View All Tournaments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.results.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {tournament.name}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Type: {tournament.tournament_type}</p>
                  <p>Venue: {tournament.venue}</p>
                  <p>Status: {tournament.status}</p>
                  <p>
                    Date: {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;