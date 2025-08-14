import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('assignmentId')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    let whereClause: any = {}
    if (assignmentId) {
      whereClause.assignmentId = assignmentId
    }

    // Get best submission for each student per assignment
    const leaderboard = assignmentId
      ? await prisma.$queryRaw`
          SELECT 
            s.studentId,
            s.assignmentId,
            u.name as studentName,
            u.email as studentEmail,
            a.name as assignmentName,
            MAX(s.score) as bestScore,
            COUNT(s.id) as totalSubmissions,
            MAX(s.timestamp) as lastSubmission,
            s.testResults as latestTestResults
          FROM Submission s
          JOIN User u ON s.studentId = u.id
          JOIN Assignment a ON s.assignmentId = a.id
          WHERE s.assignmentId = ${assignmentId}
          GROUP BY s.studentId, s.assignmentId
          ORDER BY bestScore DESC, lastSubmission DESC
          LIMIT ${Number(limit)}
        `
      : await prisma.$queryRaw`
          SELECT 
            s.studentId,
            s.assignmentId,
            u.name as studentName,
            u.email as studentEmail,
            a.name as assignmentName,
            MAX(s.score) as bestScore,
            COUNT(s.id) as totalSubmissions,
            MAX(s.timestamp) as lastSubmission,
            s.testResults as latestTestResults
          FROM Submission s
          JOIN User u ON s.studentId = u.id
          JOIN Assignment a ON s.assignmentId = a.id
          GROUP BY s.studentId, s.assignmentId
          ORDER BY bestScore DESC, lastSubmission DESC
          LIMIT ${Number(limit)}
        ` as any[]

    // Format the results
    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      studentId: entry.studentId,
      studentName: entry.studentName,
      studentEmail: entry.studentEmail,
      assignmentId: entry.assignmentId,
      assignmentName: entry.assignmentName,
      bestScore: Number(entry.bestScore),
      totalSubmissions: Number(entry.totalSubmissions),
      lastSubmission: entry.lastSubmission,
      testResults: entry.latestTestResults,
    }))

    // Get assignment statistics
    const stats = await prisma.submission.aggregate({
      where: whereClause,
      _avg: { score: true },
      _max: { score: true },
      _min: { score: true },
      _count: { id: true },
    })

    return NextResponse.json({
      success: true,
      leaderboard: formattedLeaderboard,
      statistics: {
        totalSubmissions: stats._count.id,
        averageScore: Number(stats._avg.score?.toFixed(2) || 0),
        highestScore: Number(stats._max.score || 0),
        lowestScore: Number(stats._min.score || 0),
      }
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}