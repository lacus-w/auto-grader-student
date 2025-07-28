#!/bin/bash

# Scala Auto Grader Test Runner
echo "🚀 Scala Auto Grader Test Runner"
echo "================================="

# Check if student ID is provided as argument
if [ $# -eq 0 ]; then
    echo "👤 Please enter your Student ID:"
    read -r STUDENT_ID
else
    STUDENT_ID=$1
fi

# Validate student ID
if [ -z "$STUDENT_ID" ]; then
    echo "❌ Error: Student ID cannot be empty"
    exit 1
fi

# Check for optional server submission
echo ""
echo "📡 Do you want to submit results to the server? (y/N):"
read -r SUBMIT_CHOICE

if [[ $SUBMIT_CHOICE =~ ^[Yy]$ ]]; then
    echo "🌐 Server URL (e.g., http://localhost:3000):"
    read -r SERVER_URL
    
    echo "🔑 API Key:"
    read -r API_KEY
    
    if [ -z "$SERVER_URL" ] || [ -z "$API_KEY" ]; then
        echo "❌ Error: Server URL and API Key are required for submission"
        exit 1
    fi
    
    echo ""
    echo "🧪 Running tests and submitting results..."
    sbt "run --student-id $STUDENT_ID --submit --server-url $SERVER_URL --api-key $API_KEY"
else
    echo ""
    echo "🧪 Running tests locally..."
    sbt "run --student-id $STUDENT_ID"
fi

echo ""
echo "✨ Auto grader execution completed!"