// src/test/scala/Assignment1Test.scala
import org.scalatest.funsuite.AnyFunSuite

class Assignment1Test extends AnyFunSuite {
  test("Addition should work") {
    assert(1 + 1 === 2)
  }

  test("Multiplication should work") {
    assert(2 * 3 === 6)
  }

  test("Failing test example") {
    assert(2 + 2 === 5) // This will fail
  }
}