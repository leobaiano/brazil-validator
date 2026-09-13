package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class EmailTest {

  @Test
  void isValidAcceptsValid() {
    for (String value : new String[] {
        "user@example.com", "user@mail.example.com", "user+tag@example.com", "User@Example.COM",
        "  user@example.com  ", "first.last@sub.example.com.br", "a@b.co"
    }) {
      assertTrue(Email.isValid(value), value);
    }
  }

  @Test
  void isValidRejectsInvalid() {
    String longLocalPart = "a".repeat(65) + "@example.com";
    String longEmail = "a".repeat(250) + "@example.com";

    for (String value : new String[] {
        "userexample.com", "user@example", "user@@example.com", "us er@example.com",
        "user<>@example.com", "", "        ", "user@.com", longEmail, longLocalPart
    }) {
      assertFalse(Email.isValid(value), value);
    }
  }

  @Test
  void normalize() {
    assertEquals("user@example.com", Email.normalize("  user@example.com  "));
    assertEquals("user@example.com", Email.normalize("User@Example.COM"));
    assertEquals("user@example.com", Email.normalize("user@example.com"));
  }

  @Test
  void format() {
    assertEquals("user@example.com", Email.format("  User@Example.COM  "));
  }
}
