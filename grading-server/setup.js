const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up Scala Auto Grader database...')

  // Create a default teacher user
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      id: 'teacher',
      email: 'teacher@example.com',
      name: 'Teacher',
      role: 'TEACHER',
      apiKey: 'ak_teacher_dev_12345678901234567890',
    },
  })

  console.log('✅ Created teacher user:', teacher.email)

  // Create some sample assignments
  const assignments = [
    {
      id: 'assignment1',
      name: 'Basic Scala Functions',
      description: 'Learn basic Scala function syntax and operations',
    },
    {
      id: 'assignment2',
      name: 'Collections and Higher-Order Functions',
      description: 'Working with Scala collections and functional programming',
    },
    {
      id: 'assignment3',
      name: 'Object-Oriented Programming in Scala',
      description: 'Classes, objects, and inheritance in Scala',
    },
  ]

  for (const assignment of assignments) {
    const created = await prisma.assignment.upsert({
      where: { id: assignment.id },
      update: {},
      create: assignment,
    })
    console.log('✅ Created assignment:', created.name)
  }

  // Create some sample students
  const students = [
    { id: 'john_doe', name: 'John Doe', email: 'john.doe@student.edu' },
    { id: 'jane_smith', name: 'Jane Smith', email: 'jane.smith@student.edu' },
    { id: 'bob_wilson', name: 'Bob Wilson', email: 'bob.wilson@student.edu' },
  ]

  for (const student of students) {
    const created = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        ...student,
        role: 'STUDENT',
      },
    })
    console.log('✅ Created student:', created.name)
  }

  console.log('')
  console.log('🎉 Setup completed successfully!')
  console.log('')
  console.log('📋 Summary:')
  console.log('- Teacher API Key: ak_teacher_dev_12345678901234567890')
  console.log('- 3 assignments created')
  console.log('- 3 sample students created')
  console.log('')
  console.log('🚀 You can now start the development server with: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Setup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })