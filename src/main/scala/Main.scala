// src/main/scala/Main.scala
import scopt.OParser

case class Config(
  studentId: String = "",
  assignmentId: String = "assignment1",
  serverUrl: String = "",
  apiKey: String = "",
  submitResults: Boolean = false
)

object Main extends App {
  val builder = OParser.builder[Config]
  val parser = {
    import builder._
    OParser.sequence(
      programName("scala-auto-grader"),
      head("Scala Auto Grader", "0.1"),
      
      opt[String]('s', "student-id")
        .required()
        .action((x, c) => c.copy(studentId = x))
        .text("Student ID (required)"),
        
      opt[String]('a', "assignment-id")
        .action((x, c) => c.copy(assignmentId = x))
        .text("Assignment ID (default: assignment1)"),
        
      opt[String]('u', "server-url")
        .action((x, c) => c.copy(serverUrl = x))
        .text("Server URL for submission"),
        
      opt[String]('k', "api-key")
        .action((x, c) => c.copy(apiKey = x))
        .text("API key for server authentication"),
        
      opt[Unit]("submit")
        .action((_, c) => c.copy(submitResults = true))
        .text("Submit results to server (requires server-url and api-key)"),
        
      help("help").text("Show this help message"),
      
      note("\nExamples:"),
      note("  # Run tests locally only:"),
      note("  scala-auto-grader --student-id john_doe"),
      note(""),
      note("  # Run tests and submit to server:"),
      note("  scala-auto-grader --student-id john_doe --submit --server-url http://localhost:3000 --api-key your-api-key")
    )
  }

  OParser.parse(parser, args, Config()) match {
    case Some(config) =>
      println("🚀 Scala Auto Grader - v0.1")
      println("=" * 50)
      
      // Validate submission requirements
      if (config.submitResults && (config.serverUrl.isEmpty || config.apiKey.isEmpty)) {
        println("❌ Error: --server-url and --api-key are required when using --submit")
        System.exit(1)
      }
      
      // Run the auto grader
      val result = AutoGrader.runTests(config.assignmentId, config.studentId)
      
      // Submit results if requested
      if (config.submitResults) {
        val submitted = AutoGrader.submitResults(result, config.serverUrl, config.apiKey)
        if (!submitted) {
          println("⚠️  Results were saved locally but submission failed")
        }
      } else {
        println("\n💡 Tip: Use --submit --server-url <url> --api-key <key> to submit results to server")
      }
      
    case None =>
      // arguments are bad, error message will have been displayed
      System.exit(1)
  }
}