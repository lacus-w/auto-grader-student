# 🚀 Scala Auto Grader - Deployment Guide

This guide will help you deploy the complete Scala Auto Grader system for educational use.

## 📋 System Overview

The system consists of two main components:
1. **Scala Client** - Student-facing application for running tests
2. **Next.js Server** - Teacher dashboard for viewing submissions and leaderboards

## 🔧 Prerequisites

### For Students (Scala Client)
- Java 11 or higher
- SBT (Scala Build Tool)
- Git (for cloning repositories)

### For Teachers (Next.js Server)
- Node.js 18 or higher
- npm or yarn
- SQLite (included with Node.js)

## 🎯 Quick Deployment

### Step 1: Deploy the Teacher Server

```bash
# Clone the repository
git clone <your-repo-url>
cd scala-auto-grader/grading-server

# Install dependencies
npm install

# Setup database with sample data
npm run setup

# Start the server
npm run dev
```

The server will be available at `http://localhost:3000`

### Step 2: Distribute Student Client

Students can either:
1. Clone the entire repository and use the Scala client
2. Download just the student files as a ZIP

```bash
# For students
git clone <your-repo-url>
cd scala-auto-grader

# Run tests locally
chmod +x run-tests.sh
./run-tests.sh your_student_id

# Or with server submission
./run-tests.sh your_student_id
# Then follow prompts to submit to server
```

## 🏫 Classroom Setup

### For Teachers

1. **Start the Server**:
   ```bash
   cd grading-server
   npm run dev
   ```

2. **Access Dashboard**: Open `http://localhost:3000`

3. **Get API Key**: Use `ak_teacher_dev_12345678901234567890` (development)

4. **Share with Students**:
   - Server URL: `http://your-server-address:3000`
   - API Key: Provide to students for submission

### For Students

1. **Get the Code**:
   ```bash
   git clone <repository-url>
   cd scala-auto-grader
   ```

2. **Install SBT** (if not installed):
   ```bash
   # Ubuntu/Debian
   echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | sudo tee /etc/apt/sources.list.d/sbt.list
   curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
   sudo apt-get update
   sudo apt-get install sbt
   ```

3. **Run Tests**:
   ```bash
   # Interactive mode
   ./run-tests.sh

   # Direct command
   sbt "run --student-id your_student_id"

   # With server submission
   sbt "run --student-id your_id --submit --server-url http://teacher-server:3000 --api-key provided-key"
   ```

## 🌐 Production Deployment

### Server Deployment (Heroku, DigitalOcean, etc.)

1. **Environment Variables**:
   ```bash
   DATABASE_URL="file:./prod.db"
   JWT_SECRET="your-production-jwt-secret"
   NEXTAUTH_URL="https://your-domain.com"
   ADMIN_API_KEY="your-production-api-key"
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   npm start
   ```

3. **Database Setup**:
   ```bash
   npm run setup
   ```

### Docker Deployment

1. **Create Dockerfile** (in grading-server/):
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

2. **Build and Run**:
   ```bash
   docker build -t scala-auto-grader .
   docker run -p 3000:3000 -e DATABASE_URL="file:./prod.db" scala-auto-grader
   ```

## 📚 Assignment Management

### Creating New Assignments

1. **Add to Database**:
   ```sql
   INSERT INTO Assignment (id, name, description) VALUES 
   ('assignment4', 'Advanced Scala', 'Functional programming concepts');
   ```

2. **Update Client Code**:
   - Add new test files in `src/test/scala/`
   - Update assignment dropdown in leaderboard

3. **Test Structure**:
   ```scala
   // src/test/scala/Assignment4Test.scala
   import org.scalatest.funsuite.AnyFunSuite

   class Assignment4Test extends AnyFunSuite {
     test("Higher-order functions") {
       val numbers = List(1, 2, 3, 4, 5)
       val doubled = numbers.map(_ * 2)
       assert(doubled === List(2, 4, 6, 8, 10))
     }
   }
   ```

## 🔐 Security Configuration

### API Key Management

1. **Generate Unique Keys**:
   ```javascript
   // In grading-server/setup.js
   function generateApiKey() {
     return `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
   }
   ```

2. **Rotate Keys Regularly**:
   ```sql
   UPDATE User SET apiKey = 'new-key' WHERE id = 'teacher';
   ```

### Production Security

- Use HTTPS in production
- Set strong JWT secrets
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets

## 📊 Monitoring and Analytics

### Database Queries

```sql
-- View all submissions
SELECT * FROM Submission ORDER BY timestamp DESC LIMIT 10;

-- Student performance
SELECT studentId, AVG(score) as avgScore, COUNT(*) as attempts 
FROM Submission 
GROUP BY studentId 
ORDER BY avgScore DESC;

-- Assignment difficulty
SELECT assignmentId, AVG(score) as avgScore, COUNT(*) as submissions
FROM Submission 
GROUP BY assignmentId;
```

### Server Logs

Monitor these metrics:
- Submission frequency
- Error rates
- Response times
- Database performance

## 🛠️ Troubleshooting

### Common Student Issues

1. **SBT not found**:
   ```bash
   # Install SBT using package manager
   sudo apt-get install sbt
   ```

2. **Compilation errors**:
   ```bash
   # Clean and recompile
   sbt clean compile
   ```

3. **Network issues**:
   - Check server URL
   - Verify API key
   - Test connectivity

### Common Server Issues

1. **Database connection**:
   ```bash
   npm run db:push
   npm run setup
   ```

2. **Port conflicts**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

3. **Build failures**:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

## 📈 Scaling Considerations

### For Large Classes (100+ students)

1. **Database**: Consider PostgreSQL instead of SQLite
2. **Caching**: Implement Redis for session management
3. **Load Balancing**: Use nginx for multiple server instances
4. **File Storage**: Use cloud storage for results
5. **Rate Limiting**: Prevent API abuse

### Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large result sets
- Compression for API responses
- CDN for static assets

## 🎓 Educational Best Practices

### Assignment Design

1. **Progressive Difficulty**: Start simple, increase complexity
2. **Clear Instructions**: Provide detailed test descriptions
3. **Multiple Attempts**: Allow students to retry and improve
4. **Immediate Feedback**: Show results instantly

### Grading Strategy

1. **Partial Credit**: Award points for passing individual tests
2. **Time Bonuses**: Extra points for early submissions
3. **Improvement Tracking**: Show progress over time
4. **Peer Comparison**: Anonymous leaderboards for motivation

## 📞 Support and Maintenance

### Regular Tasks

- [ ] Backup database regularly
- [ ] Update dependencies monthly
- [ ] Monitor server performance
- [ ] Review and rotate API keys
- [ ] Clean up old submission data

### Getting Help

1. Check the troubleshooting section
2. Review server logs for errors
3. Test with minimal examples
4. Contact system administrator

---

## 🎉 Success Metrics

Track these metrics to measure success:
- Student engagement (submission frequency)
- Learning progress (score improvements)
- System reliability (uptime, response times)
- User satisfaction (feedback surveys)

**Happy teaching and learning! 🚀📚**