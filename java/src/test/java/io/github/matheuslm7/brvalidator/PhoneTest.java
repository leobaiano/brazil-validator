package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PhoneTest {

  @Test
  void isValidAcceptsValid() {
    for (String value : new String[] {
        "(11) 91234-5678", "11912345678", "(11) 2345-6789", "1123456789", "(21) 2345-6789",
        "11987654321", "8534567890"
    }) {
      assertTrue(Phone.isValid(value), value);
    }
  }

  @Test
  void isValidRejectsInvalid() {
    for (String value : new String[] {
        "(00) 91234-5678", "(20) 1234-5678", "(29) 91234-5678", "11812345678", "1161234567",
        "1191234567", "111234567", "119123456789", "(11) 9ABC-5678", "11+91234-5678", "",
        "        ", "1234", "11a12345678", "119123456789012"
    }) {
      assertFalse(Phone.isValid(value), value);
    }
  }

  @Test
  void normalize() {
    assertEquals("11912345678", Phone.normalize("(11) 91234-5678"));
    assertEquals("1123456789", Phone.normalize("(11) 2345-6789"));
    assertEquals("11912345678", Phone.normalize("11912345678"));
  }

  @Test
  void format() {
    assertEquals("(11) 91234-5678", Phone.format("11912345678"));
    assertEquals("(11) 2345-6789", Phone.format("1123456789"));
    assertEquals("(11) 91234-5678", Phone.format("(11) 91234-5678"));
    assertEquals("123", Phone.format("123"));
  }
}
