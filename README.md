# 🧪 Scala Auto Grader

A comprehensive auto-grading system for Scala programming education with a friendly CLI interface and web-based leaderboard.

## 🌟 Features

### For Students
- **Easy-to-use CLI**: Simple command-line interface for running tests
- **Friendly Results**: Beautiful, emoji-rich test results with encouraging messages
- **Local Storage**: Results saved locally as JSON files
- **Server Submission**: Optional submission to teacher's server for leaderboard
- **Progress Tracking**: See your improvement over multiple attempts

### For Teachers
- **Web Dashboard**: Beautiful Next.js dashboard to view all submissions
- **Leaderboard**: Real-time student rankings and statistics
- **API Authentication**: Secure API key-based authentication
- **Assignment Management**: Support for multiple assignments
- **Statistics**: Comprehensive analytics on student performance

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│                 │ ────────────────▶│                 │
│  Scala Client   │                 │  Next.js Server │
│  (Student Side) │ ◀──────────────── │ (Teacher Side)  │
│                 │    API Response  │                 │
└─────────────────┘                 └─────────────────┘
        │                                     │
        │ Local JSON                          │ SQLite DB
        ▼                                     ▼
┌─────────────────┐                 ┌─────────────────┐
│   results/      │                 │   Leaderboard   │
│   *.json        │                 │   Statistics    │
└─────────────────┘                 └─────────────────┘
```

## 🚀 Quick Start

### Student Setup (Scala Client)

1. **Prerequisites**: Install SBT (Scala Build Tool)
   ```bash
   # Ubuntu/Debian
   echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | sudo tee /etc/apt/sources.list.d/sbt.list
   curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
   sudo apt-get update
   sudo apt-get install sbt
   ```

2. **Run Tests Locally**:
   ```bash
   chmod +x run-tests.sh
   ./run-tests.sh
   ```

3. **Or use SBT directly**:
   ```bash
   sbt "run --student-id your_student_id"
   ```

4. **Submit to Server** (optional):
   ```bash
   sbt "run --student-id your_id --submit --server-url http://localhost:3000 --api-key your-api-key"
   ```

### Teacher Setup (Next.js Server)

1. **Navigate to server directory**:
   ```bash
   cd grading-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup database and initial data**:
   ```bash
   npm run setup
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the dashboard**: Open http://localhost:3000

## 📋 Usage Examples

### Student Commands

```bash
# Basic usage (local testing only)
sbt "run --student-id john_doe"

# With specific assignment
sbt "run --student-id john_doe --assignment-id assignment2"

# Submit to server
sbt "run --student-id john_doe --submit --server-url http://teacher-server.com --api-key ak_student_12345"

# Using the interactive script
./run-tests.sh john_doe
```

### API Endpoints

#### Submit Test Results
```bash
POST /api/submissions
Authorization: Bearer ak_teacher_dev_12345678901234567890
Content-Type: application/json

{
  "studentId": "john_doe",
  "assignmentId": "assignment1",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalTests": 5,
  "passedTests": 4,
  "failedTests": 1,
  "score": 80.0,
  "executionTime": 1500,
  "testResults": [...]
}
```

#### Get Leaderboard
```bash
GET /api/leaderboard?assignmentId=assignment1&limit=20
```

## 🎯 Test Result Format

The system generates detailed JSON results:

```json
{
  "studentId": "john_doe",
  "assignmentId": "assignment1",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalTests": 3,
  "passedTests": 2,
  "failedTests": 1,
  "score": 66.7,
  "executionTime": 1250,
  "testResults": [
    {
      "testName": "Addition should work",
      "passed": true,
      "duration": 50,
      "errorMessage": null
    },
    {
      "testName": "Multiplication should work", 
      "passed": true,
      "duration": 45,
      "errorMessage": null
    },
    {
      "testName": "Failing test example",
      "passed": false,
      "duration": 30,
      "errorMessage": "Expected 5 but got 4"
    }
  ]
}
```

## 🏆 Leaderboard Features

- **Real-time Rankings**: Students ranked by best score per assignment
- **Statistics Dashboard**: Average scores, submission counts, performance trends
- **Assignment Filtering**: View leaderboard for specific assignments
- **Student Progress**: Track improvement over multiple attempts
- **Visual Indicators**: Emoji-based ranking system (🥇🥈🥉)

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# API Keys
ADMIN_API_KEY="ak_admin_12345678901234567890"
```

### Default API Keys

- **Teacher**: `ak_teacher_dev_12345678901234567890`
- **Admin**: `ak_admin_dev_12345678901234567890`

## 🧪 Writing Tests

Create your tests in `src/test/scala/`:

```scala
import org.scalatest.funsuite.AnyFunSuite

class Assignment1Test extends AnyFunSuite {
  test("Your test description") {
    // Your test code here
    assert(1 + 1 === 2)
  }
  
  test("Another test") {
    val result = someFunction(input)
    assert(result === expectedOutput)
  }
}
```

## 📊 Database Schema

The system uses SQLite with Prisma ORM:

- **Users**: Students and teachers with API keys
- **Assignments**: Programming assignments
- **Submissions**: Test results with detailed metadata
- **Relationships**: Proper foreign keys and indexing

## 🛠️ Development

### Adding New Features

1. **Scala Client**: Modify `src/main/scala/AutoGrader.scala`
2. **Web Interface**: Add components in `grading-server/app/`
3. **API Endpoints**: Create routes in `grading-server/app/api/`

### Database Changes

```bash
# Modify schema
vim grading-server/prisma/schema.prisma

# Apply changes
cd grading-server
npm run db:push
npm run db:generate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🎓 Educational Use

This system is designed specifically for educational environments:
- Encourages iterative learning
- Provides immediate feedback
- Gamifies the learning process with leaderboards
- Supports both individual practice and class-wide competition

## 🆘 Troubleshooting

### Common Issues

1. **SBT not found**: Install SBT using your package manager
2. **Database errors**: Run `npm run setup` in the grading-server directory
3. **API key issues**: Check that you're using the correct API key format
4. **Port conflicts**: Change the port in Next.js if 3000 is occupied

### Getting Help

- Check the console output for detailed error messages
- Ensure all dependencies are installed
- Verify API keys are correctly configured
- Check that the server is running before submitting results

---

Built with ❤️ for Scala education