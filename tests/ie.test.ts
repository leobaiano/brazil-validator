import { describe, expect, it } from "vitest";
import { IE } from "../src/index.js";

describe("IE", () => {
  describe("isValid", () => {
    describe("SP", () => {
      // Official worked example from SEFAZ-SP's Roteiro de Crítica.
      it("should accept the official SEFAZ-SP example with formatting", () => {
        expect(IE.isValid("110.042.490.114", "SP")).toBe(true);
      });

      it("should accept the official SEFAZ-SP example without formatting", () => {
        expect(IE.isValid("110042490114", "SP")).toBe(true);
      });

      it("should accept the UF in lowercase", () => {
        expect(IE.isValid("110042490114", "sp")).toBe(true);
      });

      it("should reject an SP IE with a wrong first check digit", () => {
        expect(IE.isValid("110042491114", "SP")).toBe(false);
      });

      it("should reject an SP IE with a wrong second check digit", () => {
        expect(IE.isValid("110042490115", "SP")).toBe(false);
      });

      it("should reject an SP IE with incorrect length", () => {
        expect(IE.isValid("11004249011", "SP")).toBe(false);
      });

      it("should reject an SP IE with letters", () => {
        expect(IE.isValid("11004249011A", "SP")).toBe(false);
      });
    });

    describe("RJ", () => {
      it("should accept a valid RJ IE with formatting", () => {
        expect(IE.isValid("99.999.99-3", "RJ")).toBe(true);
      });

      it("should accept a valid RJ IE without formatting", () => {
        expect(IE.isValid("99999993", "RJ")).toBe(true);
      });

      // Hand-verified against the weights [2,7,6,5,4,3,2] and the official
      // Sintegra RJ remainder rule (<=1 -> 0, else 11 - remainder).
      it("should accept a second, independently verified RJ IE", () => {
        expect(IE.isValid("12345674", "RJ")).toBe(true);
      });

      it("should reject an RJ IE with a wrong check digit", () => {
        expect(IE.isValid("99999994", "RJ")).toBe(false);
      });

      it("should reject an RJ IE with incorrect length", () => {
        expect(IE.isValid("9999999", "RJ")).toBe(false);
      });
    });

    describe("MG", () => {
      // Official worked example from SEFAZ-MG's Roteiro de Crítica.
      it("should accept the official SEFAZ-MG example with formatting", () => {
        expect(IE.isValid("062.307.904/0081", "MG")).toBe(true);
      });

      it("should accept the official SEFAZ-MG example without formatting", () => {
        expect(IE.isValid("0623079040081", "MG")).toBe(true);
      });

      // Independently hand-computed with the same official algorithm.
      it("should accept a second, independently computed MG IE", () => {
        expect(IE.isValid("3131234560089", "MG")).toBe(true);
      });

      it("should reject an MG IE with a wrong first check digit", () => {
        expect(IE.isValid("0623079040091", "MG")).toBe(false);
      });

      it("should reject an MG IE with a wrong second check digit", () => {
        expect(IE.isValid("0623079040082", "MG")).toBe(false);
      });

      it("should reject an MG IE with incorrect length", () => {
        expect(IE.isValid("062307904008", "MG")).toBe(false);
      });
    });

    it("should reject an empty IE", () => {
      expect(IE.isValid("", "SP")).toBe(false);
    });

    it("should reject an IE for an unsupported UF", () => {
      expect(IE.isValid("110042490114", "BA")).toBe(false);
    });

    it("should reject an IE for a nonexistent UF", () => {
      expect(IE.isValid("110042490114", "XX")).toBe(false);
    });

    it("should accept multiple valid IEs across supported states", () => {
      const validIEs: Array<[string, string]> = [
        ["110.042.490.114", "SP"],
        ["99.999.99-3", "RJ"],
        ["062.307.904/0081", "MG"],
      ];

      for (const [value, uf] of validIEs) {
        expect(IE.isValid(value, uf)).toBe(true);
      }
    });

    it("should reject multiple invalid IEs", () => {
      const invalidIEs: Array<[string, string]> = [
        ["110042491114", "SP"],
        ["99999994", "RJ"],
        ["0623079040091", "MG"],
      ];

      for (const [value, uf] of invalidIEs) {
        expect(IE.isValid(value, uf)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should remove formatting from an SP IE", () => {
      expect(IE.normalize("110.042.490.114", "SP")).toBe("110042490114");
    });

    it("should remove formatting from an RJ IE", () => {
      expect(IE.normalize("99.999.99-3", "RJ")).toBe("99999993");
    });

    it("should remove formatting from an MG IE", () => {
      expect(IE.normalize("062.307.904/0081", "MG")).toBe("0623079040081");
    });

    it("should return the original value for an unsupported UF", () => {
      expect(IE.normalize("110042490114", "BA")).toBe("110042490114");
    });
  });

  describe("format", () => {
    it("should format a normalized SP IE", () => {
      expect(IE.format("110042490114", "SP")).toBe("110.042.490.114");
    });

    it("should format a normalized RJ IE", () => {
      expect(IE.format("99999993", "RJ")).toBe("99.999.99-3");
    });

    it("should format a normalized MG IE", () => {
      expect(IE.format("0623079040081", "MG")).toBe("062.307.904/0081");
    });

    it("should return the original value when the length is invalid", () => {
      expect(IE.format("123", "SP")).toBe("123");
    });

    it("should return the original value for an unsupported UF", () => {
      expect(IE.format("110042490114", "BA")).toBe("110042490114");
    });
  });
});
