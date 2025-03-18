import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function TournamentDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');
  const [error, setError] = useState(null);

  // Fetch data
  const { data: tournament, isLoading: tournamentLoading } = useQuery(
    ['tournament', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/`);
      return response.data;
    },
    {
      retry: 1,
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to load tournament details');
      }
    }
  );

  const { data: participants, isLoading: participantsLoading } = useQuery(
    ['tournament-participants', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/participants/`);
      return response.data;
    },
    {
      enabled: !!tournament,
      retry: 1,
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to load participants');
      }
    }
  );

  const { data: points, isLoading: pointsLoading } = useQuery(
    ['tournament-points', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/points/`);
      return response.data;
    },
    {
      enabled: !!tournament,
      retry: 1,
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to load points');
      }
    }
  );

  // Mutations
  const addParticipant = useMutation(
    (data) => axios.post(`/api/tournaments/${id}/participants/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tournament-participants');
        setError(null);
      },
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to add participant');
      }
    }
  );

  const addPoints = useMutation(
    (data) => axios.post(`/api/tournaments/${id}/points/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tournament-points');
        setError(null);
      },
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to add points');
      }
    }
  );

  if (tournamentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-800 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleParticipantSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addParticipant.mutateAsync(Object.fromEntries(formData));
      e.target.reset();
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addPoints.mutateAsync(Object.fromEntries(formData));
      e.target.reset();
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
          <Link
            to={`/tournaments/${id}/results`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Results
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['info', 'participants', 'points'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Tournament Information</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{tournament.tournament_type}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Venue</dt>
                    <dd className="mt-1 text-sm text-gray-900">{tournament.venue}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add Participant</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <form onSubmit={handleParticipantSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addParticipant.isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {addParticipant.isLoading ? 'Adding...' : 'Add Participant'}
                    </button>
                  </form>
                </div>
              </div>

              {participantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Participants</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {participants?.map((participant) => (
                        <li key={participant.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {participant.name}
                            </p>
                            <p className="text-sm text-gray-500">{participant.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'points' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add Points</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <form onSubmit={handlePointsSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="participant" className="block text-sm font-medium text-gray-700">
                        Participant
                      </label>
                      <select
                        name="participant_id"
                        id="participant"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a participant</option>
                        {participants?.map((participant) => (
                          <option key={participant.id} value={participant.id}>
                            {participant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                        Points
                      </label>
                      <input
                        type="number"
                        name="points"
                        id="points"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addPoints.isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {addPoints.isLoading ? 'Adding...' : 'Add Points'}
                    </button>
                  </form>
                </div>
              </div>

              {pointsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Points</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {points?.map((point) => (
                        <li key={point.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {participants?.find(p => p.id === point.participant_id)?.name}
                            </p>
                            <p className="text-sm text-gray-500">{point.points} points</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TournamentDetail; 