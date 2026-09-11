import { describe, expect, it } from "vitest";
import { CEP } from "../src/index.js";

describe("CEP", () => {
  describe("isValid", () => {
    it("should accept a valid CEP with formatting", () => {
      expect(CEP.isValid("01310-100")).toBe(true);
    });

    it("should accept a valid CEP without formatting", () => {
      expect(CEP.isValid("01310100")).toBe(true);
    });

    it("should reject a CEP with incorrect length (too short)", () => {
      expect(CEP.isValid("0131010")).toBe(false);
    });

    it("should reject a CEP with incorrect length (too long)", () => {
      expect(CEP.isValid("013101000")).toBe(false);
    });

    it("should reject a CEP with letters", () => {
      expect(CEP.isValid("01310-10A")).toBe(false);
    });

    it("should reject unexpected characters", () => {
      expect(CEP.isValid("013abc10-100")).toBe(false);
    });

    it("should reject an empty CEP", () => {
      expect(CEP.isValid("")).toBe(false);
    });

    it("should reject a CEP with spaces only", () => {
      expect(CEP.isValid("        ")).toBe(false);
    });

    // CEP has no check-digit algorithm (unlike CPF/CNPJ), so a repeated-digit
    // sequence is not structurally invalid.
    it("should accept a CEP with repeated digits", () => {
      expect(CEP.isValid("11111-111")).toBe(true);
    });

    it("should accept multiple valid CEPs", () => {
      const validCeps = ["01310-100", "70002-900", "20040-020"];

      for (const cep of validCeps) {
        expect(CEP.isValid(cep)).toBe(true);
      }
    });

    it("should reject multiple invalid CEPs", () => {
      const invalidCeps = ["1234", "123456789", "abcde-fgh"];

      for (const cep of invalidCeps) {
        expect(CEP.isValid(cep)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should remove formatting", () => {
      expect(CEP.normalize("01310-100")).toBe("01310100");
    });

    it("should normalize a CEP without formatting", () => {
      expect(CEP.normalize("01310100")).toBe("01310100");
    });
  });

  describe("format", () => {
    it("should format a normalized CEP", () => {
      expect(CEP.format("01310100")).toBe("01310-100");
    });

    it("should keep a formatted CEP formatted", () => {
      expect(CEP.format("01310-100")).toBe("01310-100");
    });

    it("should return the original value when the length is invalid", () => {
      expect(CEP.format("123")).toBe("123");
    });
  });
});
