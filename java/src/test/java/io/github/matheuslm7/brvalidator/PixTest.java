package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PixTest {

  @Test
  void getKeyType() {
    assertEquals(PixKeyType.CPF, Pix.getKeyType("52998224725"));
    assertEquals(PixKeyType.CNPJ, Pix.getKeyType("11222333000181"));
    assertEquals(PixKeyType.EMAIL, Pix.getKeyType("user@example.com"));
    assertEquals(PixKeyType.PHONE, Pix.getKeyType("+5511987654321"));
    assertEquals(PixKeyType.EVP, Pix.getKeyType("123e4567-e89b-12d3-a456-426655440000"));
    assertNull(Pix.getKeyType("not-a-pix-key"));
  }

  @Test
  void isValidAcceptsValid() {
    for (String value : new String[] {
        "52998224725", "11222333000181", "user@example.com", "User@Example.COM",
        "+5511987654321", "+55 (11) 98765-4321",
        "123e4567-e89b-12d3-a456-426655440000", "123E4567-E89B-12D3-A456-426655440000"
    }) {
      assertTrue(Pix.isValid(value), value);
    }
  }

  @Test
  void isValidRejectsInvalid() {
    for (String value : new String[] {
        "529.982.247-25", "52998224700", "12ABC34501DE35", "11987654321", "+5500987654321",
        "+551187654321", "123456789", "123e4567-e89b-12d3-426655440000", "not a pix key!!", ""
    }) {
      assertFalse(Pix.isValid(value), value);
    }
  }

  @Test
  void normalize() {
    assertEquals("52998224725", Pix.normalize("52998224725"));
    assertEquals("user@example.com", Pix.normalize("User@Example.COM"));
    assertEquals("+5511987654321", Pix.normalize("+55 (11) 98765-4321"));
    assertEquals(
        "123e4567-e89b-12d3-a456-426655440000",
        Pix.normalize("123E4567-E89B-12D3-A456-426655440000"));
    assertEquals("not-a-pix-key", Pix.normalize("not-a-pix-key"));
  }

  @Test
  void format() {
    assertEquals("529.982.247-25", Pix.format("52998224725"));
    assertEquals("11.222.333/0001-81", Pix.format("11222333000181"));
    assertEquals("user@example.com", Pix.format("User@Example.COM"));
    assertEquals("+55 (11) 98765-4321", Pix.format("+5511987654321"));
    assertEquals(
        "123e4567-e89b-12d3-a456-426655440000",
        Pix.format("123E4567-E89B-12D3-A456-426655440000"));
    assertEquals("not-a-pix-key", Pix.format("not-a-pix-key"));
  }
}
