name := "AutoGraderStudent"

version := "0.1"

scalaVersion := "2.13.12"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.17" % Test,
  "com.typesafe.play" %% "play-json" % "2.10.1",
  "com.softwaremill.sttp.client3" %% "core" % "3.9.0",
  "com.github.scopt" %% "scopt" % "4.1.0"
)