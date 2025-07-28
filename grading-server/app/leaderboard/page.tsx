'use client'

import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  rank: number
  studentId: string
  studentName: string
  studentEmail: string
  assignmentId: string
  assignmentName: string
  bestScore: number
  totalSubmissions: number
  lastSubmission: string
}

interface Statistics {
  totalSubmissions: number
  averageScore: number
  highestScore: number
  lowestScore: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<string>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedAssignment])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const url = selectedAssignment === 'all' 
        ? '/api/leaderboard' 
        : `/api/leaderboard?assignmentId=${selectedAssignment}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setLeaderboard(data.leaderboard)
        setStatistics(data.statistics)
      } else {
        setError('Failed to fetch leaderboard')
      }
    } catch (err) {
      setError('Error loading leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">🏆 Leaderboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Student rankings based on best scores
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="input"
          >
            <option value="all">All Assignments</option>
            <option value="assignment1">Assignment 1</option>
            <option value="assignment2">Assignment 2</option>
            <option value="assignment3">Assignment 3</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {statistics.totalSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📈</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {statistics.averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🎯</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Highest Score</p>
                <p className="text-lg font-semibold text-green-600">
                  {statistics.highestScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📉</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Lowest Score</p>
                <p className="text-lg font-semibold text-red-600">
                  {statistics.lowestScore}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 mt-8">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-600">
            The leaderboard will appear once students start submitting their results.
          </p>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Best Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Last Submission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr 
                        key={`${entry.studentId}-${entry.assignmentId}`} 
                        className={`hover:bg-gray-50 ${entry.rank <= 3 ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            {getRankEmoji(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {entry.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {entry.assignmentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(entry.bestScore)}`}>
                            {entry.bestScore.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.totalSubmissions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(entry.lastSubmission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}