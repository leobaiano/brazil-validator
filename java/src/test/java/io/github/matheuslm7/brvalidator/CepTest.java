package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class CepTest {

  @Test
  void isValidAcceptsValid() {
    for (String value : new String[] {"01310-100", "01310100", "11111-111", "70002-900", "20040-020"}) {
      assertTrue(Cep.isValid(value), value);
    }
  }

  @Test
  void isValidRejectsInvalid() {
    for (String value : new String[] {
        "0131010", "013101000", "01310-10A", "013abc10-100", "", "        ", "1234", "abcde-fgh"
    }) {
      assertFalse(Cep.isValid(value), value);
    }
  }

  @Test
  void normalize() {
    assertEquals("01310100", Cep.normalize("01310-100"));
  }

  @Test
  void format() {
    assertEquals("01310-100", Cep.format("01310100"));
    assertEquals("01310-100", Cep.format("01310-100"));
    assertEquals("123", Cep.format("123"));
  }
}
