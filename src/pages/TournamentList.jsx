import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

function TournamentList() {
  const { data: tournaments, isLoading } = useQuery('tournaments', async () => {
    const response = await axios.get('/api/tournaments/');
    return response.data;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tournaments</h1>
        <Link
          to="/settings"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Tournament
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tournaments?.map((tournament) => (
            <li key={tournament.id}>
              <Link
                to={`/tournaments/${tournament.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {tournament.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tournament.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tournament.is_active ? 'Active' : 'Completed'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {tournament.tournament_type}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        {tournament.venue}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                        {new Date(tournament.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TournamentList; 