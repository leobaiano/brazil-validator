import { describe, expect, it } from "vitest";
import { CNPJ } from "../src/index.js";

describe("CNPJ", () => {
  describe("isValid", () => {
    it("should accept a valid numeric CNPJ with formatting", () => {
      expect(CNPJ.isValid("11.222.333/0001-81")).toBe(true);
    });

    it("should accept a valid numeric CNPJ without formatting", () => {
      expect(CNPJ.isValid("11222333000181")).toBe(true);
    });

    it("should reject an invalid CNPJ", () => {
      expect(CNPJ.isValid("11.222.333/0001-82")).toBe(false);
    });

    it("should reject repeated digits", () => {
      expect(CNPJ.isValid("11.111.111/1111-11")).toBe(false);
    });

    it("should reject CNPJ with incorrect length", () => {
      expect(CNPJ.isValid("1122233300018")).toBe(false);
    });

    it("should reject CNPJ with special characters", () => {
      expect(CNPJ.isValid("11.222.333/@001-81")).toBe(false);
    });
  });

  describe("normalize", () => {
    it("should remove formatting", () => {
      expect(CNPJ.normalize("11.222.333/0001-81")).toBe("11222333000181");
    });

    it("should return an already normalized CNPJ unchanged", () => {
      expect(CNPJ.normalize("11222333000181")).toBe("11222333000181");
    });
  });

  describe("format", () => {
    it("should format a normalized CNPJ", () => {
      expect(CNPJ.format("11222333000181")).toBe("11.222.333/0001-81");
    });

    it("should keep a formatted CNPJ formatted", () => {
      expect(CNPJ.format("11.222.333/0001-81")).toBe("11.222.333/0001-81");
    });

    it("should return the original value when the length is invalid", () => {
      expect(CNPJ.format("123")).toBe("123");
    });
  });

  describe("alphanumeric", () => {
    it("should accept an alphanumeric CNPJ", () => {
      expect(CNPJ.isValid("12.ABC.345/01DE-35")).toBe(true);
    });

    it("should normalize an alphanumeric CNPJ", () => {
      expect(CNPJ.normalize("12.ABC.345/01DE-35")).toBe("12ABC34501DE35");
    });

    it("should format an alphanumeric CNPJ", () => {
      expect(CNPJ.format("12ABC34501DE35")).toBe("12.ABC.345/01DE-35");
    });
  });
});
