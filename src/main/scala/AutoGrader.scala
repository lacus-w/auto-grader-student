// src/main/scala/AutoGrader.scala
import play.api.libs.json._
import sttp.client3._
import java.io.{File, PrintWriter}
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.sys.process._
import scala.util.{Try, Success, Failure}

case class TestResult(
  testName: String,
  passed: Boolean,
  duration: Long,
  errorMessage: Option[String] = None
)

case class GradingResult(
  studentId: String,
  assignmentId: String,
  timestamp: String,
  totalTests: Int,
  passedTests: Int,
  failedTests: Int,
  score: Double,
  testResults: List[TestResult],
  executionTime: Long
)

object AutoGrader {
  implicit val testResultWrites: Writes[TestResult] = Json.writes[TestResult]
  implicit val gradingResultWrites: Writes[GradingResult] = Json.writes[GradingResult]
  
  def runTests(assignmentId: String, studentId: String): GradingResult = {
    println("🧪 Running Scala Auto Grader...")
    println(s"📚 Assignment: $assignmentId")
    println(s"👤 Student: $studentId")
    println("=" * 50)
    
    val startTime = System.currentTimeMillis()
    
    // Run sbt test and capture output
    val testOutput = Try {
      val process = Process("sbt test")
      val output = process.!!
      output
    }
    
    val endTime = System.currentTimeMillis()
    val executionTime = endTime - startTime
    
    testOutput match {
      case Success(output) =>
        val testResults = parseTestOutput(output)
        val passedTests = testResults.count(_.passed)
        val totalTests = testResults.length
        val score = if (totalTests > 0) (passedTests.toDouble / totalTests) * 100 else 0.0
        
        val result = GradingResult(
          studentId = studentId,
          assignmentId = assignmentId,
          timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
          totalTests = totalTests,
          passedTests = passedTests,
          failedTests = totalTests - passedTests,
          score = score,
          testResults = testResults,
          executionTime = executionTime
        )
        
        displayResults(result)
        saveResultsLocally(result)
        result
        
      case Failure(exception) =>
        println(s"❌ Error running tests: ${exception.getMessage}")
        val result = GradingResult(
          studentId = studentId,
          assignmentId = assignmentId,
          timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
          totalTests = 0,
          passedTests = 0,
          failedTests = 0,
          score = 0.0,
          testResults = List.empty,
          executionTime = executionTime
        )
        result
    }
  }
  
  private def parseTestOutput(output: String): List[TestResult] = {
    // Simple parser for ScalaTest output
    val lines = output.split("\n")
    val testResults = scala.collection.mutable.ListBuffer[TestResult]()
    
    for (line <- lines) {
      if (line.contains("- ")) {
        val testName = line.substring(line.indexOf("- ") + 2).trim
        val passed = !line.contains("*** FAILED ***")
        testResults += TestResult(testName, passed, 0) // Duration would need more complex parsing
      }
    }
    
    // If no tests parsed, create some dummy results based on output
    if (testResults.isEmpty) {
      if (output.contains("BUILD SUCCESSFUL")) {
        List(TestResult("All tests", true, 0))
      } else {
        List(TestResult("Test execution", false, 0, Some("Build failed")))
      }
    } else {
      testResults.toList
    }
  }
  
  private def displayResults(result: GradingResult): Unit = {
    println("\n🎯 GRADING RESULTS")
    println("=" * 50)
    println(s"📊 Score: ${result.score.formatted("%.1f")}% (${result.passedTests}/${result.totalTests})")
    println(s"⏱️  Execution Time: ${result.executionTime}ms")
    println(s"📅 Timestamp: ${result.timestamp}")
    println("\n📝 Test Details:")
    
    result.testResults.foreach { test =>
      val status = if (test.passed) "✅" else "❌"
      println(s"  $status ${test.testName}")
      test.errorMessage.foreach(msg => println(s"     Error: $msg"))
    }
    
    println("\n" + "=" * 50)
    
    if (result.score >= 90) {
      println("🏆 Excellent work!")
    } else if (result.score >= 70) {
      println("👍 Good job!")
    } else if (result.score >= 50) {
      println("📈 Keep improving!")
    } else {
      println("💪 Don't give up, keep trying!")
    }
  }
  
  private def saveResultsLocally(result: GradingResult): Unit = {
    val resultsDir = new File("results")
    if (!resultsDir.exists()) resultsDir.mkdirs()
    
    val filename = s"results/${result.studentId}_${result.assignmentId}_${System.currentTimeMillis()}.json"
    val writer = new PrintWriter(new File(filename))
    try {
      writer.write(Json.prettyPrint(Json.toJson(result)))
      println(s"💾 Results saved to: $filename")
    } finally {
      writer.close()
    }
  }
  
  def submitResults(result: GradingResult, serverUrl: String, apiKey: String): Boolean = {
    println(s"\n🚀 Submitting results to server...")
    
    val backend = HttpClientSyncBackend()
    val request = basicRequest
      .post(uri"$serverUrl/api/submissions")
      .header("Authorization", s"Bearer $apiKey")
      .header("Content-Type", "application/json")
      .body(Json.toJson(result).toString())
    
    Try {
      val response = request.send(backend)
      response.code.isSuccess
    } match {
      case Success(true) =>
        println("✅ Results submitted successfully!")
        true
      case Success(false) =>
        println("❌ Failed to submit results to server")
        false
      case Failure(exception) =>
        println(s"❌ Error submitting results: ${exception.getMessage}")
        false
    }
  }
}