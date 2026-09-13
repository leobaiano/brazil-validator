package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class CpfTest {

  @Test
  void isValidAcceptsValid() {
    for (String value : new String[] {
        "529.982.247-25", "52998224725", "529 982 247 25", "111.444.777-35", "935.411.347-80"
    }) {
      assertTrue(Cpf.isValid(value), value);
    }
  }

  @Test
  void isValidRejectsInvalid() {
    for (String value : new String[] {
        "529.982.247-26", "111.444.777-36", "935.411.347-81", "111.111.111-11", "123456789",
        "529.982.247-2A", "           ", "", "529abc982xyz247-25"
    }) {
      assertFalse(Cpf.isValid(value), value);
    }
  }

  @Test
  void normalize() {
    assertEquals("52998224725", Cpf.normalize("529.982.247-25"));
    assertEquals("52998224725", Cpf.normalize("52998224725"));
    assertEquals("52998224725", Cpf.normalize("529 982 247 25"));
  }

  @Test
  void format() {
    assertEquals("529.982.247-25", Cpf.format("52998224725"));
    assertEquals("529.982.247-25", Cpf.format("529.982.247-25"));
    assertEquals("123", Cpf.format("123"));
    assertEquals("529982247", Cpf.format("529982247"));
  }
}
