# 🌐 Scala Auto Grader - Server

The teacher-facing web dashboard for the Scala Auto Grader system. Built with Next.js, TypeScript, and Prisma.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database and initial data
npm run setup

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run setup` - Initialize database with sample data
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🏗️ Project Structure

```
grading-server/
├── app/
│   ├── api/
│   │   ├── submissions/     # Student submission API
│   │   └── leaderboard/     # Leaderboard API
│   ├── lib/
│   │   ├── prisma.ts        # Database client
│   │   └── auth.ts          # Authentication utilities
│   ├── components/          # React components (future)
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard page
│   └── leaderboard/
│       └── page.tsx         # Leaderboard page
├── prisma/
│   └── schema.prisma        # Database schema
├── setup.js                 # Database setup script
└── package.json
```

## 🗄️ Database Schema

### Users
- `id`: Unique identifier
- `email`: User email
- `name`: Display name
- `role`: STUDENT | TEACHER | ADMIN
- `apiKey`: Authentication key for API access

### Assignments
- `id`: Assignment identifier
- `name`: Assignment display name
- `description`: Assignment description
- `maxScore`: Maximum possible score
- `dueDate`: Optional due date
- `isActive`: Whether assignment is active

### Submissions
- `id`: Unique submission ID
- `studentId`: Reference to student
- `assignmentId`: Reference to assignment
- `timestamp`: When test was run
- `totalTests`: Number of tests
- `passedTests`: Number of passed tests
- `score`: Percentage score
- `executionTime`: Test execution time
- `testResults`: JSON array of individual test results

## 🔐 API Authentication

All API endpoints require authentication via API key in the Authorization header:

```
Authorization: Bearer ak_teacher_dev_12345678901234567890
```

### Default API Keys

After running `npm run setup`:
- **Teacher**: `ak_teacher_dev_12345678901234567890`

## 🛠️ API Endpoints

### POST /api/submissions
Submit test results from student client.

**Request:**
```json
{
  "studentId": "john_doe",
  "assignmentId": "assignment1", 
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalTests": 5,
  "passedTests": 4,
  "failedTests": 1,
  "score": 80.0,
  "executionTime": 1500,
  "testResults": [
    {
      "testName": "Addition should work",
      "passed": true,
      "duration": 50,
      "errorMessage": null
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "cm5abc123",
  "message": "Submission recorded successfully"
}
```

### GET /api/submissions
Retrieve submissions with optional filtering.

**Query Parameters:**
- `studentId`: Filter by student
- `assignmentId`: Filter by assignment
- `limit`: Number of results (default: 10)

### GET /api/leaderboard
Get student rankings and statistics.

**Query Parameters:**
- `assignmentId`: Filter by assignment
- `limit`: Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "studentId": "john_doe",
      "studentName": "John Doe",
      "assignmentName": "Basic Scala Functions",
      "bestScore": 95.0,
      "totalSubmissions": 3,
      "lastSubmission": "2024-01-15T10:30:00.000Z"
    }
  ],
  "statistics": {
    "totalSubmissions": 25,
    "averageScore": 78.5,
    "highestScore": 100.0,
    "lowestScore": 45.0
  }
}
```

## 🎨 UI Features

### Dashboard
- Recent submissions table
- Student progress overview
- Real-time updates
- Responsive design

### Leaderboard
- Student rankings by best score
- Assignment filtering
- Performance statistics
- Visual indicators (🥇🥈🥉)

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Customization

#### Adding New Assignments
1. Add to database via Prisma Studio or setup script
2. Update assignment dropdown in leaderboard page

#### Styling
- Modify `globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Customize color scheme in `tailwind.config.js`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
1. Set production environment variables
2. Use PostgreSQL for production database
3. Configure proper JWT secrets
4. Set up reverse proxy (nginx/Apache)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Monitoring

### Database Queries
Use Prisma Studio to inspect database:
```bash
npm run db:studio
```

### Logs
Server logs include:
- Submission receipts
- Authentication attempts
- API errors
- Performance metrics

## 🛡️ Security

### API Key Management
- Generate unique keys for each teacher
- Rotate keys regularly
- Store securely (environment variables)

### Input Validation
- All API inputs are validated
- SQL injection protection via Prisma
- XSS protection in React components

### Rate Limiting
Consider adding rate limiting for production:
```bash
npm install express-rate-limit
```

## 🧪 Testing

### Manual Testing
1. Start server: `npm run dev`
2. Use Postman/curl to test API endpoints
3. Submit test data via Scala client

### Database Testing
```bash
# Reset database
rm prisma/dev.db
npm run setup
```

## 📊 Analytics

The system tracks:
- Submission frequency
- Score distributions
- Student progress over time
- Assignment difficulty metrics

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Prisma for all database operations
3. Implement proper error handling
4. Add JSDoc comments for functions
5. Test API endpoints thoroughly

## 🆘 Troubleshooting

### Common Issues

**Database connection errors:**
```bash
npm run db:push
npm run db:generate
```

**Missing API key:**
- Check `.env` file
- Verify API key format
- Run setup script again

**Port already in use:**
```bash
# Change port in package.json or kill process
lsof -ti:3000 | xargs kill -9
```

**Build failures:**
- Clear `.next` directory
- Reinstall dependencies
- Check TypeScript errors

---

Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS