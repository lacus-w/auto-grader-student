import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { validateApiKey } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix
    const user = await validateApiKey(apiKey)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      studentId,
      assignmentId,
      timestamp,
      totalTests,
      passedTests,
      failedTests,
      score,
      testResults,
      executionTime
    } = body

    // Validate required fields
    if (!studentId || !assignmentId || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, assignmentId, timestamp' },
        { status: 400 }
      )
    }

    // Ensure assignment exists
    let assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      // Create assignment if it doesn't exist
      assignment = await prisma.assignment.create({
        data: {
          id: assignmentId,
          name: assignmentId,
          description: `Auto-created assignment: ${assignmentId}`,
        }
      })
    }

    // Ensure user exists
    let student = await prisma.user.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      // Create student if doesn't exist
      student = await prisma.user.create({
        data: {
          id: studentId,
          email: `${studentId}@student.edu`,
          name: studentId,
          role: 'STUDENT',
        }
      })
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        timestamp: new Date(timestamp),
        totalTests: totalTests || 0,
        passedTests: passedTests || 0,
        failedTests: failedTests || 0,
        score: score || 0,
        executionTime: executionTime || 0,
        testResults: testResults || [],
      }
    })

    console.log(`✅ Submission received: ${studentId} - ${assignmentId} - Score: ${score}%`)

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Submission recorded successfully'
    })

  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const assignmentId = searchParams.get('assignmentId')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereClause: any = {}
    if (studentId) whereClause.studentId = studentId
    if (assignmentId) whereClause.assignmentId = assignmentId

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignment: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      submissions
    })

  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}