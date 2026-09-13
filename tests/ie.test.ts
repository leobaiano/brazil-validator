import { describe, expect, it } from "vitest";
import { IE } from "../src/index.js";

// Every value below is either the exact worked example published by the
// state's own SEFAZ "Roteiro de Crítica da Inscrição Estadual" (mirrored at
// sintegra.gov.br/Cad_Estados/cad_XX.html), or, where the source describes
// the algorithm without a numeric example (RJ's weights, MG's second
// vector, MS), a value independently hand-computed against that same
// official algorithm. DF is the one exception: sintegra.gov.br's own DF
// page is empty, so its vector instead comes from two independent secondary
// sources that agree with each other and whose arithmetic was re-checked by
// hand (see src/ie/states/df.ts for details).
const OFFICIAL_VECTORS: Array<[string, string]> = [
  ["SP", "110042490114"],
  ["RJ", "99999993"],
  ["RJ", "12345674"],
  ["MG", "0623079040081"],
  ["MG", "3131234560089"],
  ["AC", "0100482300112"],
  ["AL", "240000048"],
  ["AM", "999999990"],
  ["AP", "030123459"],
  ["BA", "12345663"],
  ["BA", "61234557"],
  ["BA", "100000306"],
  ["CE", "060000015"],
  ["ES", "999999990"],
  ["GO", "109876547"],
  ["MA", "120000385"],
  ["MS", "281234566"],
  ["MT", "00130000019"],
  ["PA", "159999995"],
  ["PA", "750000023"],
  ["PB", "060000015"],
  ["PE", "032141840"],
  ["PI", "012345679"],
  ["PR", "1234567850"],
  ["RN", "200400401"],
  ["RN", "2000400400"],
  ["RO", "00000000625213"],
  ["RR", "240061536"],
  ["RR", "240066281"],
  ["RR", "240017556"],
  ["RR", "240034290"],
  ["RR", "240013603"],
  ["RR", "240082668"],
  ["RR", "240073562"],
  ["RR", "240054674"],
  ["RR", "240041455"],
  ["RR", "240013407"],
  ["RS", "2243658792"],
  ["SC", "251040852"],
  ["SE", "271234563"],
  ["TO", "29010227836"],
  ["DF", "0730000100109"],
];

// SP's "Produtor Rural" format is deliberately excluded from this list: its
// last 3 digits are explicitly unused in the check-digit calculation, so
// flipLastDigit() below would not actually invalidate it. It has its own
// dedicated tests instead (see the SP describe block).
function flipLastDigit(value: string): string {
  const lastDigit = Number(value[value.length - 1]);

  return value.slice(0, -1) + String((lastDigit + 1) % 10);
}

describe("IE", () => {
  describe("isValid", () => {
    describe("SP", () => {
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

      // Official "Produtor Rural" worked example. The source's own
      // restatement of this example ("P-011000424.3/002", 14 characters)
      // contradicts its "13 caracteres" rule and its own calculation, so it
      // is treated as a typo — see src/ie/states/sp.ts.
      it("should accept the official Produtor Rural example with formatting", () => {
        expect(IE.isValid("P-01100424.3/002", "SP")).toBe(true);
      });

      it("should accept the official Produtor Rural example without formatting", () => {
        expect(IE.isValid("P011004243002", "SP")).toBe(true);
      });

      it("should accept a lowercase 'p' for a Produtor Rural IE", () => {
        expect(IE.isValid("p-01100424.3/002", "SP")).toBe(true);
      });

      it("should reject a Produtor Rural IE with a wrong check digit", () => {
        expect(IE.isValid("P-01100424.4/002", "SP")).toBe(false);
      });

      it("should reject a Produtor Rural IE missing the fixed '0' after P", () => {
        expect(IE.isValid("P-11100424.3/002", "SP")).toBe(false);
      });

      it("should reject a Produtor Rural IE with incorrect length", () => {
        expect(IE.isValid("P-0110042.3/002", "SP")).toBe(false);
      });
    });

    describe("RJ", () => {
      it("should accept a valid RJ IE with formatting", () => {
        expect(IE.isValid("99.999.99-3", "RJ")).toBe(true);
      });

      it("should accept a valid RJ IE without formatting", () => {
        expect(IE.isValid("99999993", "RJ")).toBe(true);
      });

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
      it("should accept the official SEFAZ-MG example with formatting", () => {
        expect(IE.isValid("062.307.904/0081", "MG")).toBe(true);
      });

      it("should accept the official SEFAZ-MG example without formatting", () => {
        expect(IE.isValid("0623079040081", "MG")).toBe(true);
      });

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

    describe("AC", () => {
      it("should accept the official SEFAZ-AC example with formatting", () => {
        expect(IE.isValid("01.004.823/001-12", "AC")).toBe(true);
      });

      it("should reject an AC IE not starting with 01", () => {
        expect(IE.isValid("0200482300112", "AC")).toBe(false);
      });

      it("should reject an AC IE with a wrong check digit", () => {
        expect(IE.isValid("0100482300113", "AC")).toBe(false);
      });
    });

    describe("AL", () => {
      it("should accept the official SEFAZ-AL example", () => {
        expect(IE.isValid("240000048", "AL")).toBe(true);
      });

      it("should reject an AL IE with an invalid 'tipo de empresa' digit", () => {
        expect(IE.isValid("241000048", "AL")).toBe(false);
      });

      it("should reject an AL IE with a wrong check digit", () => {
        expect(IE.isValid("240000049", "AL")).toBe(false);
      });
    });

    describe("AM", () => {
      it("should accept the derived AM example", () => {
        expect(IE.isValid("99.999.999-0", "AM")).toBe(true);
      });

      it("should reject an AM IE with a wrong check digit", () => {
        expect(IE.isValid("999999991", "AM")).toBe(false);
      });
    });

    describe("AP", () => {
      it("should accept the official SEFAZ-AP example", () => {
        expect(IE.isValid("030123459", "AP")).toBe(true);
      });

      it("should reject an AP IE not starting with 03", () => {
        expect(IE.isValid("040123459", "AP")).toBe(false);
      });

      it("should reject an AP IE with a wrong check digit", () => {
        expect(IE.isValid("030123450", "AP")).toBe(false);
      });
    });

    describe("BA", () => {
      it("should accept the official 8-digit módulo-10 example", () => {
        expect(IE.isValid("123456-63", "BA")).toBe(true);
      });

      it("should accept the official 8-digit módulo-11 example", () => {
        expect(IE.isValid("612345-57", "BA")).toBe(true);
      });

      it("should accept the official 9-digit módulo-10 example", () => {
        expect(IE.isValid("1000003-06", "BA")).toBe(true);
      });

      it("should reject a BA IE with a wrong check digit", () => {
        expect(IE.isValid("123456-64", "BA")).toBe(false);
      });
    });

    describe("CE", () => {
      it("should accept the official SEFAZ-CE example", () => {
        expect(IE.isValid("06000001-5", "CE")).toBe(true);
      });

      it("should reject a CE IE with a wrong check digit", () => {
        expect(IE.isValid("06000001-6", "CE")).toBe(false);
      });
    });

    describe("ES", () => {
      it("should accept the official SEFAZ-ES example", () => {
        expect(IE.isValid("999999990", "ES")).toBe(true);
      });

      it("should reject an ES IE with a wrong check digit", () => {
        expect(IE.isValid("999999991", "ES")).toBe(false);
      });
    });

    describe("GO", () => {
      it("should accept the official SEFAZ-GO example", () => {
        expect(IE.isValid("10.987.654-7", "GO")).toBe(true);
      });

      it("should reject a GO IE with an invalid prefix", () => {
        expect(IE.isValid("15.987.654-7", "GO")).toBe(false);
      });

      it("should reject a GO IE with a wrong check digit", () => {
        expect(IE.isValid("10.987.654-8", "GO")).toBe(false);
      });
    });

    describe("MA", () => {
      it("should accept the official SEFAZ-MA example", () => {
        expect(IE.isValid("120000385", "MA")).toBe(true);
      });

      it("should reject an MA IE with a wrong check digit", () => {
        expect(IE.isValid("120000386", "MA")).toBe(false);
      });
    });

    describe("MS", () => {
      it("should accept the independently computed MS example", () => {
        expect(IE.isValid("281234566", "MS")).toBe(true);
      });

      it("should reject an MS IE with an invalid prefix", () => {
        expect(IE.isValid("291234566", "MS")).toBe(false);
      });

      it("should reject an MS IE with a wrong check digit", () => {
        expect(IE.isValid("281234567", "MS")).toBe(false);
      });
    });

    describe("MT", () => {
      it("should accept the official SEFAZ-MT example", () => {
        expect(IE.isValid("0013000001-9", "MT")).toBe(true);
      });

      it("should reject an MT IE with a wrong check digit", () => {
        expect(IE.isValid("0013000001-8", "MT")).toBe(false);
      });
    });

    describe("PA", () => {
      it("should accept the first official SEFAZ-PA example", () => {
        expect(IE.isValid("15999999-5", "PA")).toBe(true);
      });

      it("should accept the second official SEFAZ-PA example", () => {
        expect(IE.isValid("75000002-3", "PA")).toBe(true);
      });

      it("should reject a PA IE with an invalid prefix", () => {
        expect(IE.isValid("16999999-5", "PA")).toBe(false);
      });
    });

    describe("PB", () => {
      it("should accept the official SEFAZ-PB example", () => {
        expect(IE.isValid("06000001-5", "PB")).toBe(true);
      });

      it("should reject a PB IE with a wrong check digit", () => {
        expect(IE.isValid("06000001-6", "PB")).toBe(false);
      });
    });

    describe("PE", () => {
      it("should accept the official e-Fisco example", () => {
        expect(IE.isValid("0321418-40", "PE")).toBe(true);
      });

      it("should reject a PE IE with a wrong first check digit", () => {
        expect(IE.isValid("0321418-50", "PE")).toBe(false);
      });

      it("should reject a PE IE with a wrong second check digit", () => {
        expect(IE.isValid("0321418-41", "PE")).toBe(false);
      });
    });

    describe("PI", () => {
      it("should accept the official SEFAZ-PI example", () => {
        expect(IE.isValid("012345679", "PI")).toBe(true);
      });

      it("should reject a PI IE with a wrong check digit", () => {
        expect(IE.isValid("012345670", "PI")).toBe(false);
      });
    });

    describe("PR", () => {
      it("should accept the official SEFAZ-PR example", () => {
        expect(IE.isValid("123.45678-50", "PR")).toBe(true);
      });

      it("should reject a PR IE with a wrong first check digit", () => {
        expect(IE.isValid("123.45678-60", "PR")).toBe(false);
      });

      it("should reject a PR IE with a wrong second check digit", () => {
        expect(IE.isValid("123.45678-51", "PR")).toBe(false);
      });
    });

    describe("RN", () => {
      it("should accept the official 9-digit SEFAZ-RN example", () => {
        expect(IE.isValid("20.040.040-1", "RN")).toBe(true);
      });

      it("should accept the official 10-digit SEFAZ-RN example", () => {
        expect(IE.isValid("20.0.040.040-0", "RN")).toBe(true);
      });

      it("should reject an RN IE not starting with 20", () => {
        expect(IE.isValid("21.040.040-1", "RN")).toBe(false);
      });

      it("should reject an RN IE with a wrong check digit", () => {
        expect(IE.isValid("20.040.040-2", "RN")).toBe(false);
      });
    });

    describe("RO", () => {
      it("should accept the official SEFAZ-RO example", () => {
        expect(IE.isValid("0000000062521-3", "RO")).toBe(true);
      });

      it("should reject an RO IE with a wrong check digit", () => {
        expect(IE.isValid("0000000062521-4", "RO")).toBe(false);
      });
    });

    describe("RR", () => {
      it("should accept the official SEFAZ-RR worked example", () => {
        expect(IE.isValid("24006153-6", "RR")).toBe(true);
      });

      it("should accept every other officially listed valid RR example", () => {
        const officialRR = [
          "24006628-1",
          "24001755-6",
          "24003429-0",
          "24001360-3",
          "24008266-8",
          "24007356-2",
          "24005467-4",
          "24004145-5",
          "24001340-7",
        ];

        for (const value of officialRR) {
          expect(IE.isValid(value, "RR")).toBe(true);
        }
      });

      it("should reject an RR IE with a wrong check digit", () => {
        expect(IE.isValid("24006153-7", "RR")).toBe(false);
      });
    });

    describe("RS", () => {
      it("should accept the official SEFAZ-RS example", () => {
        expect(IE.isValid("224/3658792", "RS")).toBe(true);
      });

      it("should reject an RS IE with a wrong check digit", () => {
        expect(IE.isValid("224/3658793", "RS")).toBe(false);
      });
    });

    describe("SC", () => {
      it("should accept the official SEFAZ-SC example", () => {
        expect(IE.isValid("251.040.852", "SC")).toBe(true);
      });

      it("should reject an SC IE with a wrong check digit", () => {
        expect(IE.isValid("251.040.853", "SC")).toBe(false);
      });
    });

    describe("SE", () => {
      it("should accept the official SEFAZ-SE example", () => {
        expect(IE.isValid("27123456-3", "SE")).toBe(true);
      });

      it("should reject an SE IE with a wrong check digit", () => {
        expect(IE.isValid("27123456-4", "SE")).toBe(false);
      });
    });

    describe("DF", () => {
      it("should accept the DF example with formatting", () => {
        expect(IE.isValid("07.300.001.001-09", "DF")).toBe(true);
      });

      it("should accept the DF example without formatting", () => {
        expect(IE.isValid("0730000100109", "DF")).toBe(true);
      });

      it("should reject a DF IE not starting with 07", () => {
        expect(IE.isValid("0830000100109", "DF")).toBe(false);
      });

      it("should reject a DF IE with a wrong first check digit", () => {
        expect(IE.isValid("0730000100119", "DF")).toBe(false);
      });

      it("should reject a DF IE with a wrong second check digit", () => {
        expect(IE.isValid("0730000100108", "DF")).toBe(false);
      });
    });

    describe("TO", () => {
      it("should accept the official SEFAZ-TO example", () => {
        expect(IE.isValid("29010227836", "TO")).toBe(true);
      });

      it("should reject a TO IE with an invalid 'tipo' code", () => {
        expect(IE.isValid("29040227836", "TO")).toBe(false);
      });

      it("should reject a TO IE with a wrong check digit", () => {
        expect(IE.isValid("29010227837", "TO")).toBe(false);
      });
    });

    it("should reject an empty IE", () => {
      expect(IE.isValid("", "SP")).toBe(false);
    });

    it("should reject an IE for a nonexistent UF", () => {
      expect(IE.isValid("110042490114", "XX")).toBe(false);
    });

    it("should accept every officially verified vector across all 27 states", () => {
      for (const [uf, value] of OFFICIAL_VECTORS) {
        expect(IE.isValid(value, uf)).toBe(true);
      }
    });

    it("should reject every officially verified vector once its check digit is altered", () => {
      for (const [uf, value] of OFFICIAL_VECTORS) {
        expect(IE.isValid(flipLastDigit(value), uf)).toBe(false);
      }
    });
  });

  describe("normalize", () => {
    it("should remove formatting from an SP IE", () => {
      expect(IE.normalize("110.042.490.114", "SP")).toBe("110042490114");
    });

    it("should remove formatting from a Produtor Rural SP IE and uppercase the P", () => {
      expect(IE.normalize("p-01100424.3/002", "SP")).toBe("P011004243002");
    });

    it("should remove formatting from an RJ IE", () => {
      expect(IE.normalize("99.999.99-3", "RJ")).toBe("99999993");
    });

    it("should remove formatting from an MG IE", () => {
      expect(IE.normalize("062.307.904/0081", "MG")).toBe("0623079040081");
    });

    it("should remove formatting from a BA IE", () => {
      expect(IE.normalize("123456-63", "BA")).toBe("12345663");
    });

    it("should remove formatting from an RS IE", () => {
      expect(IE.normalize("224/3658792", "RS")).toBe("2243658792");
    });

    it("should remove formatting from a DF IE", () => {
      expect(IE.normalize("07.300.001.001-09", "DF")).toBe("0730000100109");
    });

    it("should return the original value for a nonexistent UF", () => {
      expect(IE.normalize("110042490114", "XX")).toBe("110042490114");
    });
  });

  describe("format", () => {
    it("should format a normalized SP IE", () => {
      expect(IE.format("110042490114", "SP")).toBe("110.042.490.114");
    });

    it("should format a normalized Produtor Rural SP IE", () => {
      expect(IE.format("P011004243002", "SP")).toBe("P-01100424.3/002");
    });

    it("should format a normalized RJ IE", () => {
      expect(IE.format("99999993", "RJ")).toBe("99.999.99-3");
    });

    it("should format a normalized MG IE", () => {
      expect(IE.format("0623079040081", "MG")).toBe("062.307.904/0081");
    });

    it("should format a normalized AC IE", () => {
      expect(IE.format("0100482300112", "AC")).toBe("01.004.823/001-12");
    });

    it("should return the plain digits for a state with no official mask (AL)", () => {
      expect(IE.format("240000048", "AL")).toBe("240000048");
    });

    it("should format a normalized AM IE", () => {
      expect(IE.format("999999990", "AM")).toBe("99.999.999-0");
    });

    it("should format a normalized 8-digit BA IE", () => {
      expect(IE.format("12345663", "BA")).toBe("123456-63");
    });

    it("should format a normalized 9-digit BA IE", () => {
      expect(IE.format("100000306", "BA")).toBe("1000003-06");
    });

    it("should format a normalized CE IE", () => {
      expect(IE.format("060000015", "CE")).toBe("06000001-5");
    });

    it("should format a normalized GO IE", () => {
      expect(IE.format("109876547", "GO")).toBe("10.987.654-7");
    });

    it("should format a normalized MT IE", () => {
      expect(IE.format("00130000019", "MT")).toBe("0013000001-9");
    });

    it("should format a normalized PR IE", () => {
      expect(IE.format("1234567850", "PR")).toBe("123.45678-50");
    });

    it("should format a normalized 9-digit RN IE", () => {
      expect(IE.format("200400401", "RN")).toBe("20.040.040-1");
    });

    it("should format a normalized 10-digit RN IE", () => {
      expect(IE.format("2000400400", "RN")).toBe("20.0.040.040-0");
    });

    it("should format a normalized RO IE", () => {
      expect(IE.format("00000000625213", "RO")).toBe("0000000062521-3");
    });

    it("should format a normalized RR IE", () => {
      expect(IE.format("240061536", "RR")).toBe("24006153-6");
    });

    it("should format a normalized SC IE", () => {
      expect(IE.format("251040852", "SC")).toBe("251.040.852");
    });

    it("should format a normalized SE IE", () => {
      expect(IE.format("271234563", "SE")).toBe("27123456-3");
    });

    it("should format a normalized DF IE", () => {
      expect(IE.format("0730000100109", "DF")).toBe("07.300.001.001-09");
    });

    it("should return the original value when the length is invalid", () => {
      expect(IE.format("123", "SP")).toBe("123");
    });

    it("should return the original value for a nonexistent UF", () => {
      expect(IE.format("110042490114", "XX")).toBe("110042490114");
    });
  });
});
