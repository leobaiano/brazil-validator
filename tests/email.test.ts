import { describe, expect, it } from "vitest";
import { Email } from "../src/index.js";

describe("Email", () => {
  describe("isValid", () => {
    it("should accept a simple valid email", () => {
      expect(Email.isValid("user@example.com")).toBe(true);
    });

    it("should accept a valid email with a subdomain", () => {
      expect(Email.isValid("user@mail.example.com")).toBe(true);
    });

    it("should accept a valid email with a plus tag", () => {
      expect(Email.isValid("user+tag@example.com")).toBe(true);
    });

    it("should accept a valid email regardless of casing", () => {
      expect(Email.isValid("User@Example.COM")).toBe(true);
    });

    it("should accept a valid email with surrounding whitespace", () => {
      expect(Email.isValid("  user@example.com  ")).toBe(true);
    });

    it("should reject an email without an @ symbol", () => {
      expect(Email.isValid("userexample.com")).toBe(false);
    });

    it("should reject an email without a domain TLD", () => {
      expect(Email.isValid("user@example")).toBe(false);
    });

    it("should reject an email with two @ symbols", () => {
      expect(Email.isValid("user@@example.com")).toBe(false);
    });

    it("should reject an email with internal whitespace", () => {
      expect(Email.isValid("us er@example.com")).toBe(false);
    });

    it("should reject an email with unexpected characters", () => {
      expect(Email.isValid("user<>@example.com")).toBe(false);
    });

    it("should reject an empty email", () => {
      expect(Email.isValid("")).toBe(false);
    });

    it("should reject an email with spaces only", () => {
      expect(Email.isValid("        ")).toBe(false);
    });

    it("should reject an email exceeding the maximum total length", () => {
      const longEmail = `${"a".repeat(250)}@example.com`;

      expect(Email.isValid(longEmail)).toBe(false);
    });

    it("should reject an email whose local part exceeds 64 characters", () => {
      const longLocalPart = `${"a".repeat(65)}@example.com`;

      expect(Email.isValid(longLocalPart)).toBe(false);
    });

    it("should accept multiple valid emails", () => {
      const validEmails = ["user@example.com", "first.last@sub.example.com.br", "a@b.co"];

      for (const email of validEmails) {
        expect(Email.isValid(email)).toBe(true);
      }
    });

    it("should reject multiple invalid emails", () => {
      const invalidEmails = ["userexample.com", "user@@example.com", "user@example", "user@.com"];

      for (const email of invalidEmails) {
        expect(Email.isValid(email)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should trim surrounding whitespace", () => {
      expect(Email.normalize("  user@example.com  ")).toBe("user@example.com");
    });

    it("should lowercase the email", () => {
      expect(Email.normalize("User@Example.COM")).toBe("user@example.com");
    });

    it("should keep an already normalized email unchanged", () => {
      expect(Email.normalize("user@example.com")).toBe("user@example.com");
    });
  });

  describe("format", () => {
    // Unlike CPF/CNPJ/CEP/Phone, an email address has no punctuation mask to
    // apply, so format() produces the same canonical result as normalize().
    it("should trim and lowercase the email, same as normalize", () => {
      expect(Email.format("  User@Example.COM  ")).toBe("user@example.com");
    });

    it("should keep an already formatted email unchanged", () => {
      expect(Email.format("user@example.com")).toBe("user@example.com");
    });
  });
});
