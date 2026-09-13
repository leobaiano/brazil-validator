package io.github.matheuslm7.brvalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.github.matheuslm7.brvalidator.ie.Ie;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;

/**
 * Checks this Java implementation against specification/*&#47;vectors.json, the
 * language-independent test vectors generated from the TypeScript implementation. If this
 * passes, the Java port behaves identically to TypeScript (and to the Go and Python ports) for
 * every vector on file.
 */
class ConformanceTest {

  private static JSONArray loadVectors(String name) throws IOException {
    Path path = Paths.get("..", "specification", name, "vectors.json");
    String content = Files.readString(path);
    return new JSONArray(content);
  }

  @Test
  void cpf() throws IOException {
    for (Object item : loadVectors("cpf")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      assertEquals(v.getBoolean("valid"), Cpf.isValid(input), input);
      assertEquals(v.getString("normalized"), Cpf.normalize(input), input);
      assertEquals(v.getString("formatted"), Cpf.format(input), input);
    }
  }

  @Test
  void cnpj() throws IOException {
    for (Object item : loadVectors("cnpj")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      assertEquals(v.getBoolean("valid"), Cnpj.isValid(input), input);
      assertEquals(v.getString("normalized"), Cnpj.normalize(input), input);
      assertEquals(v.getString("formatted"), Cnpj.format(input), input);
    }
  }

  @Test
  void cep() throws IOException {
    for (Object item : loadVectors("cep")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      assertEquals(v.getBoolean("valid"), Cep.isValid(input), input);
      assertEquals(v.getString("normalized"), Cep.normalize(input), input);
      assertEquals(v.getString("formatted"), Cep.format(input), input);
    }
  }

  @Test
  void phone() throws IOException {
    for (Object item : loadVectors("phone")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      assertEquals(v.getBoolean("valid"), Phone.isValid(input), input);
      assertEquals(v.getString("normalized"), Phone.normalize(input), input);
      assertEquals(v.getString("formatted"), Phone.format(input), input);
    }
  }

  @Test
  void email() throws IOException {
    for (Object item : loadVectors("email")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      assertEquals(v.getBoolean("valid"), Email.isValid(input), input);
      assertEquals(v.getString("normalized"), Email.normalize(input), input);
      assertEquals(v.getString("formatted"), Email.format(input), input);
    }
  }

  @Test
  void pix() throws IOException {
    for (Object item : loadVectors("pix")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      PixKeyType wantKeyType = v.isNull("keyType") ? null : PixKeyType.valueOf(v.getString("keyType"));
      assertEquals(wantKeyType, Pix.getKeyType(input), input);
      assertEquals(v.getBoolean("valid"), Pix.isValid(input), input);
      assertEquals(v.getString("normalized"), Pix.normalize(input), input);
      assertEquals(v.getString("formatted"), Pix.format(input), input);
    }
  }

  @Test
  void ie() throws IOException {
    for (Object item : loadVectors("ie")) {
      JSONObject v = (JSONObject) item;
      String input = v.getString("input");
      String uf = v.getString("uf");
      assertEquals(v.getBoolean("valid"), Ie.isValid(input, uf), input + " " + uf);
      assertEquals(v.getString("normalized"), Ie.normalize(input, uf), input + " " + uf);
      assertEquals(v.getString("formatted"), Ie.format(input, uf), input + " " + uf);
    }
  }
}
