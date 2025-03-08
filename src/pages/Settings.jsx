import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('tournaments');

  // Fetch data
  const { data: tournaments } = useQuery('tournaments', async () => {
    const response = await axios.get('/api/tournaments/');
    return response.data;
  });

  const { data: clubs } = useQuery('clubs', async () => {
    const response = await axios.get('/api/clubs/');
    return response.data;
  });

  const { data: golfers } = useQuery('golfers', async () => {
    const response = await axios.get('/api/golfers/');
    return response.data;
  });

  const { data: users } = useQuery('users', async () => {
    const response = await axios.get('/api/users/list/');
    return response.data;
  });

  // Mutations
  const createTournament = useMutation(
    (data) => axios.post('/api/tournaments/', data),
    {
      onSuccess: () => queryClient.invalidateQueries('tournaments'),
    }
  );

  const createClub = useMutation(
    (data) => axios.post('/api/clubs/', data),
    {
      onSuccess: () => queryClient.invalidateQueries('clubs'),
    }
  );

  const createGolfer = useMutation(
    (data) => axios.post('/api/golfers/', data),
    {
      onSuccess: () => queryClient.invalidateQueries('golfers'),
    }
  );

  const createUser = useMutation(
    (data) => axios.post('/api/users/register/', data),
    {
      onSuccess: () => queryClient.invalidateQueries('users'),
    }
  );

  // Form handlers
  const handleTournamentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createTournament.mutate(Object.fromEntries(formData));
  };

  const handleClubSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createClub.mutate(Object.fromEntries(formData));
  };

  const handleGolferSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createGolfer.mutate(Object.fromEntries(formData));
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createUser.mutate(Object.fromEntries(formData));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['tournaments', 'clubs', 'golfers', 'users'].map((tab) => (
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
        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Tournaments</h2>
            <form onSubmit={handleTournamentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="tournament_type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="inter_club">Inter-Club</option>
                  <option value="individual">Individual</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Meets
                </label>
                <input
                  type="number"
                  name="number_of_meets"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rounds to Count
                </label>
                <input
                  type="number"
                  name="rounds_to_count"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Tournament
              </button>
            </form>
          </div>
        )}

        {activeTab === 'clubs' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Clubs</h2>
            <form onSubmit={handleClubSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Club
              </button>
            </form>
          </div>
        )}

        {activeTab === 'golfers' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Golfers</h2>
            <form onSubmit={handleGolferSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Club
                </label>
                <select
                  name="club_id"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {clubs?.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Handicap
                </label>
                <input
                  type="number"
                  name="handicap"
                  step="0.1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Golfer
              </button>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Users</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password2"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Admin
                </label>
                <input
                  type="checkbox"
                  name="is_admin"
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create User
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
