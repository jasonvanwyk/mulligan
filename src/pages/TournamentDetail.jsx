import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function TournamentDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');

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

  const { data: points, isLoading: pointsLoading } = useQuery(
    ['tournament-points', id],
    async () => {
      const response = await axios.get(`/api/tournaments/${id}/points/`);
      return response.data;
    }
  );

  // Mutations
  const addParticipant = useMutation(
    (data) => axios.post(`/api/tournaments/${id}/participants/`, data),
    {
      onSuccess: () => queryClient.invalidateQueries('tournament-participants'),
    }
  );

  const addPoints = useMutation(
    (data) => axios.post(`/api/tournaments/${id}/points/`, data),
    {
      onSuccess: () => queryClient.invalidateQueries('tournament-points'),
    }
  );

  if (tournamentLoading || participantsLoading || pointsLoading) {
    return <div>Loading...</div>;
  }

  const handleParticipantSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addParticipant.mutate(Object.fromEntries(formData));
  };

  const handlePointsSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addPoints.mutate(Object.fromEntries(formData));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {tournament.name}
        </h1>
        <div className="flex space-x-3">
          <Link
            to={`/tournaments/${id}/results`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enter Results
          </Link>
          <a
            href={`/api/tournaments/${id}/standings/pdf/`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Print Standings
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
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

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tournament Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.tournament_type}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Venue</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.venue}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Dates</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Meets
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.number_of_meets}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Rounds to Count
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.rounds_to_count}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Participants</h2>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Participant
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {participants?.map((participant) => (
                  <li key={participant.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {participant.is_club_participant
                            ? participant.club.name
                            : participant.golfer.full_name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {participant.is_club_participant
                              ? 'Club'
                              : 'Individual'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Points</h2>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Points
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {points?.map((point) => (
                  <li key={point.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Position {point.position}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {point.points} points
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentDetail; 