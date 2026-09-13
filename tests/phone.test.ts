import { describe, expect, it } from "vitest";
import { Phone } from "../src/index.js";

describe("Phone", () => {
  describe("isValid", () => {
    it("should accept a valid mobile number with formatting", () => {
      expect(Phone.isValid("(11) 91234-5678")).toBe(true);
    });

    it("should accept a valid mobile number without formatting", () => {
      expect(Phone.isValid("11912345678")).toBe(true);
    });

    it("should accept a valid landline number with formatting", () => {
      expect(Phone.isValid("(11) 2345-6789")).toBe(true);
    });

    it("should accept a valid landline number without formatting", () => {
      expect(Phone.isValid("1123456789")).toBe(true);
    });

    it("should reject a DDD that does not exist in the Brazilian numbering plan", () => {
      expect(Phone.isValid("(00) 91234-5678")).toBe(false);
      expect(Phone.isValid("(20) 1234-5678")).toBe(false);
      expect(Phone.isValid("(29) 91234-5678")).toBe(false);
    });

    // Mobile numbers must carry the ninth digit "9" (Anatel Resolução 553/2010).
    it("should reject an 11-digit number whose subscriber part does not start with 9", () => {
      expect(Phone.isValid("11812345678")).toBe(false);
    });

    // Fixed-line subscriber numbers start with 2, 3, 4 or 5.
    it("should reject a landline whose subscriber part starts with an invalid digit", () => {
      expect(Phone.isValid("1161234567")).toBe(false);
      expect(Phone.isValid("1191234567")).toBe(false);
    });

    it("should reject a phone number with incorrect length (too short)", () => {
      expect(Phone.isValid("111234567")).toBe(false);
    });

    it("should reject a phone number with incorrect length (too long)", () => {
      expect(Phone.isValid("119123456789")).toBe(false);
    });

    it("should reject a phone number with letters", () => {
      expect(Phone.isValid("(11) 9ABC-5678")).toBe(false);
    });

    it("should reject unexpected characters", () => {
      expect(Phone.isValid("11+91234-5678")).toBe(false);
    });

    it("should reject an empty phone number", () => {
      expect(Phone.isValid("")).toBe(false);
    });

    it("should reject a phone number with spaces only", () => {
      expect(Phone.isValid("        ")).toBe(false);
    });

    it("should accept multiple valid phone numbers", () => {
      const validPhones = ["(11) 91234-5678", "(21) 2345-6789", "11987654321", "8534567890"];

      for (const phone of validPhones) {
        expect(Phone.isValid(phone)).toBe(true);
      }
    });

    it("should reject multiple invalid phone numbers", () => {
      const invalidPhones = ["1234", "(00) 91234-5678", "11a12345678", "119123456789012"];

      for (const phone of invalidPhones) {
        expect(Phone.isValid(phone)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should remove formatting from a mobile number", () => {
      expect(Phone.normalize("(11) 91234-5678")).toBe("11912345678");
    });

    it("should remove formatting from a landline number", () => {
      expect(Phone.normalize("(11) 2345-6789")).toBe("1123456789");
    });

    it("should keep an already normalized number unchanged", () => {
      expect(Phone.normalize("11912345678")).toBe("11912345678");
    });
  });

  describe("format", () => {
    it("should format a normalized mobile number", () => {
      expect(Phone.format("11912345678")).toBe("(11) 91234-5678");
    });

    it("should format a normalized landline number", () => {
      expect(Phone.format("1123456789")).toBe("(11) 2345-6789");
    });

    it("should keep an already formatted number formatted", () => {
      expect(Phone.format("(11) 91234-5678")).toBe("(11) 91234-5678");
    });

    it("should return the original value when the length is invalid", () => {
      expect(Phone.format("123")).toBe("123");
    });
  });
});
