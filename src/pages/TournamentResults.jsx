import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function TournamentResults() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [roundNumber, setRoundNumber] = useState(1);
  const [score, setScore] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
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

  const { data: results, isLoading: resultsLoading } = useQuery(
    ['tournament-results', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/results/`);
      return response.data;
    },
    {
      enabled: !!tournament,
      retry: 1,
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to load results');
      }
    }
  );

  // Mutation
  const addResult = useMutation(
    (data) => axios.post(`/api/tournaments/${id}/results/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tournament-results');
        setScore('');
        setDatePlayed('');
        setError(null);
      },
      onError: (err) => {
        setError(err.response?.data?.detail || 'Failed to add result');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParticipant || !score || !datePlayed) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await addResult.mutateAsync({
        participant_id: selectedParticipant,
        round_number: roundNumber,
        score: parseInt(score),
        date_played: datePlayed,
      });
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tournament Results</h1>
          <h2 className="text-xl text-gray-600">{tournament.name}</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Add Result Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add Result</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="participant" className="block text-sm font-medium text-gray-700">
                    Participant
                  </label>
                  <select
                    id="participant"
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
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
                  <label htmlFor="round" className="block text-sm font-medium text-gray-700">
                    Round Number
                  </label>
                  <input
                    type="number"
                    id="round"
                    value={roundNumber}
                    onChange={(e) => setRoundNumber(parseInt(e.target.value))}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700">
                    Score
                  </label>
                  <input
                    type="number"
                    id="score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date Played
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={datePlayed}
                    onChange={(e) => setDatePlayed(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={addResult.isLoading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {addResult.isLoading ? 'Adding...' : 'Add Result'}
                </button>
              </form>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Results</h3>
            </div>
            <div className="border-t border-gray-200">
              {resultsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : results?.length === 0 ? (
                <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  No results yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {results?.map((result) => (
                    <li key={result.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {participants?.find(p => p.id === result.participant_id)?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Round {result.round_number} • {new Date(result.date_played).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{result.score}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentResults; 