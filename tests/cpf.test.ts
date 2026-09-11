import { describe, expect, it } from "vitest";
import { CPF } from "../src/index.js";

describe("CPF", () => {
  describe("isValid", () => {
    it("should accept a valid CPF with formatting", () => {
      expect(CPF.isValid("529.982.247-25")).toBe(true);
    });

    it("should accept a valid CPF without formatting", () => {
      expect(CPF.isValid("52998224725")).toBe(true);
    });

    it("should reject an invalid CPF", () => {
      expect(CPF.isValid("529.982.247-26")).toBe(false);
    });

    it("should reject repeated digits", () => {
      expect(CPF.isValid("111.111.111-11")).toBe(false);
    });

    it("should reject CPF with incorrect length", () => {
      expect(CPF.isValid("123456789")).toBe(false);
    });

    it("should reject CPF with letters", () => {
      expect(CPF.isValid("529.982.247-2A")).toBe(false);
    });

    it("should reject CPF with spaces only", () => {
      expect(CPF.isValid("           ")).toBe(false);
    });

    it("should reject an empty CPF", () => {
      expect(CPF.isValid("")).toBe(false);
    });

    it("should reject unexpected characters", () => {
      expect(CPF.isValid("529abc982xyz247-25")).toBe(false);
    });
  });

  describe("normalize", () => {
    it("should remove formatting", () => {
      expect(CPF.normalize("529.982.247-25")).toBe("52998224725");
    });

    it("should normalize formatted CPF", () => {
      expect(CPF.normalize("529.982.247-25")).toBe("52998224725");
    });
  });

  describe("format", () => {
    it("should format a normalized CPF", () => {
      expect(CPF.format("52998224725")).toBe("529.982.247-25");
    });

    it("should format a CPF that already has formatting", () => {
      expect(CPF.format("529.982.247-25")).toBe("529.982.247-25");
    });

    it("should return the original value when the length is invalid", () => {
      expect(CPF.format("123")).toBe("123");
    });

    it("should not change an invalid length", () => {
      expect(CPF.format("529982247")).toBe("529982247");
    });
  });
});
