import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function TournamentResults() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [score, setScore] = useState('');
  const [datePlayed, setDatePlayed] = useState('');

  // Fetch data
  const { data: tournament, isLoading: tournamentLoading } = useQuery(
    ['tournament', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/`);
      return response.data;
    }
  );

  const { data: participants, isLoading: participantsLoading } = useQuery(
    ['tournament-participants', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/participants/`);
      return response.data;
    }
  );

  const { data: results, isLoading: resultsLoading } = useQuery(
    ['tournament-results', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/results/`);
      return response.data;
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
      },
    }
  );

  if (tournamentLoading || participantsLoading || resultsLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedParticipant || !score || !datePlayed) return;

    addResult.mutate({
      participant_id: selectedParticipant,
      round_number: roundNumber,
      score: parseInt(score),
      date_played: datePlayed,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Enter Results - {tournament.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Enter New Result
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Participant
                </label>
                <select
                  value={selectedParticipant || ''}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a participant</option>
                  {participants?.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.is_club_participant
                        ? participant.club.name
                        : participant.golfer.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Round Number
                </label>
                <input
                  type="number"
                  min="1"
                  max={tournament.number_of_meets}
                  value={roundNumber}
                  onChange={(e) => setRoundNumber(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Played
                </label>
                <input
                  type="date"
                  value={datePlayed}
                  onChange={(e) => setDatePlayed(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Result
              </button>
            </form>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Results
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {results?.slice(0, 5).map((result) => (
                    <li key={result.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.participant.is_club_participant
                              ? result.participant.club.name
                              : result.participant.golfer.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Round {result.round_number} - Score: {result.score}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(result.date_played).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentResults; 