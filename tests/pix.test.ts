import { describe, expect, it } from "vitest";
import { PIX } from "../src/index.js";

describe("PIX", () => {
  describe("getKeyType", () => {
    it("should detect a CPF key", () => {
      expect(PIX.getKeyType("52998224725")).toBe("CPF");
    });

    it("should detect a CNPJ key", () => {
      expect(PIX.getKeyType("11222333000181")).toBe("CNPJ");
    });

    it("should detect an email key", () => {
      expect(PIX.getKeyType("user@example.com")).toBe("EMAIL");
    });

    it("should detect a phone key", () => {
      expect(PIX.getKeyType("+5511987654321")).toBe("PHONE");
    });

    it("should detect a random key (EVP)", () => {
      expect(PIX.getKeyType("123e4567-e89b-12d3-a456-426655440000")).toBe("EVP");
    });

    it("should return null for an unrecognizable value", () => {
      expect(PIX.getKeyType("not-a-pix-key")).toBeNull();
    });
  });

  describe("isValid", () => {
    it("should accept a valid CPF key", () => {
      expect(PIX.isValid("52998224725")).toBe(true);
    });

    it("should reject a CPF key with formatting punctuation", () => {
      // The DICT "chave" field for CPF/CNPJ is digits-only, per Bacen's
      // official pix-dict-api schema (^[0-9]{11}$ / ^[0-9]{14}$).
      expect(PIX.isValid("529.982.247-25")).toBe(false);
    });

    it("should reject a CPF key with an invalid check digit", () => {
      expect(PIX.isValid("52998224700")).toBe(false);
    });

    it("should accept a valid numeric CNPJ key", () => {
      expect(PIX.isValid("11222333000181")).toBe(true);
    });

    it("should reject an alphanumeric CNPJ as a PIX key", () => {
      // Bacen's DICT schema only accepts numeric CNPJ (^[0-9]{14}$) today.
      expect(PIX.isValid("12ABC34501DE35")).toBe(false);
    });

    it("should accept a valid email key", () => {
      expect(PIX.isValid("user@example.com")).toBe(true);
    });

    it("should accept an email key regardless of casing", () => {
      expect(PIX.isValid("User@Example.COM")).toBe(true);
    });

    it("should reject an email key longer than 77 characters", () => {
      const longEmail = `${"a".repeat(70)}@example.com`;

      expect(longEmail.length).toBeGreaterThan(77);
      expect(PIX.isValid(longEmail)).toBe(false);
    });

    it("should accept a valid mobile phone key", () => {
      expect(PIX.isValid("+5511987654321")).toBe(true);
    });

    it("should accept a valid mobile phone key with formatting", () => {
      expect(PIX.isValid("+55 (11) 98765-4321")).toBe(true);
    });

    it("should reject a phone key without the +55 country code", () => {
      expect(PIX.isValid("11987654321")).toBe(false);
    });

    it("should reject a phone key with an invalid DDD", () => {
      expect(PIX.isValid("+5500987654321")).toBe(false);
    });

    it("should reject a phone key missing the mobile ninth digit", () => {
      expect(PIX.isValid("+551187654321")).toBe(false);
    });

    it("should accept a valid random key (EVP)", () => {
      expect(PIX.isValid("123e4567-e89b-12d3-a456-426655440000")).toBe(true);
    });

    it("should accept a random key regardless of casing", () => {
      expect(PIX.isValid("123E4567-E89B-12D3-A456-426655440000")).toBe(true);
    });

    it("should reject a random key with the wrong number of segments", () => {
      expect(PIX.isValid("123e4567-e89b-12d3-426655440000")).toBe(false);
    });

    it("should reject a key with incorrect length", () => {
      expect(PIX.isValid("123456789")).toBe(false);
    });

    it("should reject unexpected characters", () => {
      expect(PIX.isValid("not a pix key!!")).toBe(false);
    });

    it("should reject an empty key", () => {
      expect(PIX.isValid("")).toBe(false);
    });

    it("should accept multiple valid keys of different types", () => {
      const validKeys = [
        "52998224725",
        "11222333000181",
        "user@example.com",
        "+5511987654321",
        "123e4567-e89b-12d3-a456-426655440000",
      ];

      for (const key of validKeys) {
        expect(PIX.isValid(key)).toBe(true);
      }
    });

    it("should reject multiple invalid keys", () => {
      const invalidKeys = ["529.982.247-25", "11987654321", "not-a-pix-key", ""];

      for (const key of invalidKeys) {
        expect(PIX.isValid(key)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should keep a CPF key unchanged", () => {
      expect(PIX.normalize("52998224725")).toBe("52998224725");
    });

    it("should lowercase an email key", () => {
      expect(PIX.normalize("User@Example.COM")).toBe("user@example.com");
    });

    it("should strip formatting from a phone key", () => {
      expect(PIX.normalize("+55 (11) 98765-4321")).toBe("+5511987654321");
    });

    it("should lowercase a random key", () => {
      expect(PIX.normalize("123E4567-E89B-12D3-A456-426655440000")).toBe(
        "123e4567-e89b-12d3-a456-426655440000",
      );
    });

    it("should return the original value when the type cannot be detected", () => {
      expect(PIX.normalize("not-a-pix-key")).toBe("not-a-pix-key");
    });
  });

  describe("format", () => {
    it("should format a CPF key with punctuation", () => {
      expect(PIX.format("52998224725")).toBe("529.982.247-25");
    });

    it("should format a CNPJ key with punctuation", () => {
      expect(PIX.format("11222333000181")).toBe("11.222.333/0001-81");
    });

    it("should format an email key as lowercase", () => {
      expect(PIX.format("User@Example.COM")).toBe("user@example.com");
    });

    it("should format a phone key with a country code and mask", () => {
      expect(PIX.format("+5511987654321")).toBe("+55 (11) 98765-4321");
    });

    it("should format a random key as lowercase", () => {
      expect(PIX.format("123E4567-E89B-12D3-A456-426655440000")).toBe(
        "123e4567-e89b-12d3-a456-426655440000",
      );
    });

    it("should return the original value when the type cannot be detected", () => {
      expect(PIX.format("not-a-pix-key")).toBe("not-a-pix-key");
    });
  });
});
