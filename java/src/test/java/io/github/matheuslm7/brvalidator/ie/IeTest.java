package io.github.matheuslm7.brvalidator.ie;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class IeTest {

  private static final class Vector {
    final String uf;
    final String value;

    Vector(String uf, String value) {
      this.uf = uf;
      this.value = value;
    }
  }

  // Every value below is either the exact worked example published by the state's own SEFAZ
  // "Roteiro de Crítica da Inscrição Estadual" (mirrored at
  // sintegra.gov.br/Cad_Estados/cad_XX.html), or, where the source describes the algorithm
  // without a numeric example (RJ's weights, MG's second vector, MS), a value independently
  // hand-computed against that same official algorithm. DF is the one exception:
  // sintegra.gov.br's own DF page is empty, so its vector instead comes from two independent
  // secondary sources that agree with each other and whose arithmetic was re-checked by hand
  // (see Df.java). This mirrors the vectors used by the TypeScript, Go, and Python test suites,
  // so all four ports are checked against the same regression data.
  private static final List<Vector> OFFICIAL_VECTORS = List.of(
      new Vector("SP", "110042490114"),
      new Vector("RJ", "99999993"),
      new Vector("RJ", "12345674"),
      new Vector("MG", "0623079040081"),
      new Vector("MG", "3131234560089"),
      new Vector("AC", "0100482300112"),
      new Vector("AL", "240000048"),
      new Vector("AM", "999999990"),
      new Vector("AP", "030123459"),
      new Vector("BA", "12345663"),
      new Vector("BA", "61234557"),
      new Vector("BA", "100000306"),
      new Vector("CE", "060000015"),
      new Vector("ES", "999999990"),
      new Vector("GO", "109876547"),
      new Vector("MA", "120000385"),
      new Vector("MS", "281234566"),
      new Vector("MT", "00130000019"),
      new Vector("PA", "159999995"),
      new Vector("PA", "750000023"),
      new Vector("PB", "060000015"),
      new Vector("PE", "032141840"),
      new Vector("PI", "012345679"),
      new Vector("PR", "1234567850"),
      new Vector("RN", "200400401"),
      new Vector("RN", "2000400400"),
      new Vector("RO", "00000000625213"),
      new Vector("RR", "240061536"),
      new Vector("RR", "240066281"),
      new Vector("RR", "240017556"),
      new Vector("RR", "240034290"),
      new Vector("RR", "240013603"),
      new Vector("RR", "240082668"),
      new Vector("RR", "240073562"),
      new Vector("RR", "240054674"),
      new Vector("RR", "240041455"),
      new Vector("RR", "240013407"),
      new Vector("RS", "2243658792"),
      new Vector("SC", "251040852"),
      new Vector("SE", "271234563"),
      new Vector("TO", "29010227836"),
      new Vector("DF", "0730000100109")
  );

  private static String flipLastDigit(String value) {
    int last = value.charAt(value.length() - 1) - '0';
    return value.substring(0, value.length() - 1) + ((last + 1) % 10);
  }

  @Test
  void officialVectorsAreValid() {
    for (Vector v : OFFICIAL_VECTORS) {
      assertTrue(Ie.isValid(v.value, v.uf), v.uf + " " + v.value);
    }
  }

  @Test
  void tamperedOfficialVectorsAreInvalid() {
    for (Vector v : OFFICIAL_VECTORS) {
      String tampered = flipLastDigit(v.value);
      assertFalse(Ie.isValid(tampered, v.uf), v.uf + " " + tampered);
    }
  }

  @Test
  void formattedOfficialExamples() {
    List<Vector> cases = List.of(
        new Vector("SP", "110.042.490.114"),
        new Vector("RJ", "99.999.99-3"),
        new Vector("MG", "062.307.904/0081"),
        new Vector("AC", "01.004.823/001-12"),
        new Vector("AM", "99.999.999-0"),
        new Vector("BA", "123456-63"),
        new Vector("BA", "612345-57"),
        new Vector("BA", "1000003-06"),
        new Vector("CE", "06000001-5"),
        new Vector("GO", "10.987.654-7"),
        new Vector("MT", "0013000001-9"),
        new Vector("PA", "15999999-5"),
        new Vector("PA", "75000002-3"),
        new Vector("PE", "0321418-40"),
        new Vector("PR", "123.45678-50"),
        new Vector("RN", "20.040.040-1"),
        new Vector("RN", "20.0.040.040-0"),
        new Vector("RO", "0000000062521-3"),
        new Vector("RR", "24006153-6"),
        new Vector("RS", "224/3658792"),
        new Vector("SC", "251.040.852"),
        new Vector("SE", "27123456-3"),
        new Vector("DF", "07.300.001.001-09"),
        new Vector("SP", "P-01100424.3/002")
    );

    for (Vector v : cases) {
      assertTrue(Ie.isValid(v.value, v.uf), v.uf + " " + v.value);
    }
  }

  @Test
  void prefixAndTypeConstraints() {
    List<Vector> invalid = List.of(
        new Vector("AC", "0200482300112"),
        new Vector("AL", "241000048"),
        new Vector("AP", "040123459"),
        new Vector("GO", "159876547"),
        new Vector("MS", "291234566"),
        new Vector("PA", "169999995"),
        new Vector("RN", "210400401"),
        new Vector("RR", "230061536"),
        new Vector("TO", "29040227836"),
        new Vector("DF", "0830000100109")
    );

    for (Vector v : invalid) {
      assertFalse(Ie.isValid(v.value, v.uf), v.uf + " " + v.value);
    }
  }

  @Test
  void produtorRural() {
    assertTrue(Ie.isValid("P-01100424.3/002", "SP"));
    assertTrue(Ie.isValid("p-01100424.3/002", "SP"));
    assertFalse(Ie.isValid("P-01100424.4/002", "SP"));
    assertFalse(Ie.isValid("P-11100424.3/002", "SP"));
    assertEquals("P011004243002", Ie.normalize("p-01100424.3/002", "SP"));
    assertEquals("P-01100424.3/002", Ie.format("P011004243002", "SP"));
  }

  @Test
  void unsupportedUf() {
    assertFalse(Ie.isValid("110042490114", "XX"));
    assertEquals("110042490114", Ie.normalize("110042490114", "XX"));
    assertEquals("110042490114", Ie.format("110042490114", "XX"));
  }

  @Test
  void normalizeAndFormatRoundTrip() {
    List<String[]> cases = List.of(
        new String[] {"SP", "110.042.490.114", "110042490114"},
        new String[] {"RJ", "99.999.99-3", "99999993"},
        new String[] {"MG", "062.307.904/0081", "0623079040081"},
        new String[] {"BA", "123456-63", "12345663"},
        new String[] {"RS", "224/3658792", "2243658792"},
        new String[] {"DF", "07.300.001.001-09", "0730000100109"}
    );

    for (String[] c : cases) {
      String uf = c[0];
      String formatted = c[1];
      String normalized = c[2];
      assertEquals(normalized, Ie.normalize(formatted, uf), uf);
      assertEquals(formatted, Ie.format(normalized, uf), uf);
    }

    assertEquals("123", Ie.format("123", "SP"));
  }
}
