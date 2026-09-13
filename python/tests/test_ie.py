import unittest

from br_validator import ie

# Every value below is either the exact worked example published by the
# state's own SEFAZ "Roteiro de Crítica da Inscrição Estadual" (mirrored at
# sintegra.gov.br/Cad_Estados/cad_XX.html), or, where the source describes
# the algorithm without a numeric example (RJ's weights, MG's second
# vector, MS), a value independently hand-computed against that same
# official algorithm. DF is the one exception: sintegra.gov.br's own DF
# page is empty, so its vector instead comes from two independent
# secondary sources that agree with each other and whose arithmetic was
# re-checked by hand (see _df.py for details). This mirrors the vectors
# used by the TypeScript and Go test suites, so all three ports are
# checked against the same regression data.
OFFICIAL_VECTORS = [
    ("SP", "110042490114"),
    ("RJ", "99999993"),
    ("RJ", "12345674"),
    ("MG", "0623079040081"),
    ("MG", "3131234560089"),
    ("AC", "0100482300112"),
    ("AL", "240000048"),
    ("AM", "999999990"),
    ("AP", "030123459"),
    ("BA", "12345663"),
    ("BA", "61234557"),
    ("BA", "100000306"),
    ("CE", "060000015"),
    ("ES", "999999990"),
    ("GO", "109876547"),
    ("MA", "120000385"),
    ("MS", "281234566"),
    ("MT", "00130000019"),
    ("PA", "159999995"),
    ("PA", "750000023"),
    ("PB", "060000015"),
    ("PE", "032141840"),
    ("PI", "012345679"),
    ("PR", "1234567850"),
    ("RN", "200400401"),
    ("RN", "2000400400"),
    ("RO", "00000000625213"),
    ("RR", "240061536"),
    ("RR", "240066281"),
    ("RR", "240017556"),
    ("RR", "240034290"),
    ("RR", "240013603"),
    ("RR", "240082668"),
    ("RR", "240073562"),
    ("RR", "240054674"),
    ("RR", "240041455"),
    ("RR", "240013407"),
    ("RS", "2243658792"),
    ("SC", "251040852"),
    ("SE", "271234563"),
    ("TO", "29010227836"),
    ("DF", "0730000100109"),
]


def flip_last_digit(value: str) -> str:
    last = int(value[-1])
    return value[:-1] + str((last + 1) % 10)


class TestOfficialVectors(unittest.TestCase):
    def test_valid(self):
        for uf, value in OFFICIAL_VECTORS:
            with self.subTest(uf=uf, value=value):
                self.assertTrue(ie.is_valid(value, uf))

    def test_tampered_is_invalid(self):
        for uf, value in OFFICIAL_VECTORS:
            tampered = flip_last_digit(value)
            with self.subTest(uf=uf, value=tampered):
                self.assertFalse(ie.is_valid(tampered, uf))


class TestFormattedOfficialExamples(unittest.TestCase):
    def test_formatted(self):
        cases = [
            ("110.042.490.114", "SP"),
            ("99.999.99-3", "RJ"),
            ("062.307.904/0081", "MG"),
            ("01.004.823/001-12", "AC"),
            ("99.999.999-0", "AM"),
            ("123456-63", "BA"),
            ("612345-57", "BA"),
            ("1000003-06", "BA"),
            ("06000001-5", "CE"),
            ("10.987.654-7", "GO"),
            ("0013000001-9", "MT"),
            ("15999999-5", "PA"),
            ("75000002-3", "PA"),
            ("0321418-40", "PE"),
            ("123.45678-50", "PR"),
            ("20.040.040-1", "RN"),
            ("20.0.040.040-0", "RN"),
            ("0000000062521-3", "RO"),
            ("24006153-6", "RR"),
            ("224/3658792", "RS"),
            ("251.040.852", "SC"),
            ("27123456-3", "SE"),
            ("07.300.001.001-09", "DF"),
            ("P-01100424.3/002", "SP"),
        ]
        for value, uf in cases:
            with self.subTest(value=value, uf=uf):
                self.assertTrue(ie.is_valid(value, uf))


class TestPrefixAndTypeConstraints(unittest.TestCase):
    def test_invalid(self):
        cases = [
            ("AC", "0200482300112"),
            ("AL", "241000048"),
            ("AP", "040123459"),
            ("GO", "159876547"),
            ("MS", "291234566"),
            ("PA", "169999995"),
            ("RN", "210400401"),
            ("RR", "230061536"),
            ("TO", "29040227836"),
            ("DF", "0830000100109"),
        ]
        for uf, value in cases:
            with self.subTest(uf=uf, value=value):
                self.assertFalse(ie.is_valid(value, uf))


class TestProdutorRural(unittest.TestCase):
    def test_valid(self):
        self.assertTrue(ie.is_valid("P-01100424.3/002", "SP"))
        self.assertTrue(ie.is_valid("p-01100424.3/002", "SP"))

    def test_wrong_check_digit(self):
        self.assertFalse(ie.is_valid("P-01100424.4/002", "SP"))

    def test_missing_fixed_zero(self):
        self.assertFalse(ie.is_valid("P-11100424.3/002", "SP"))

    def test_normalize(self):
        self.assertEqual(ie.normalize("p-01100424.3/002", "SP"), "P011004243002")

    def test_format(self):
        self.assertEqual(ie.format("P011004243002", "SP"), "P-01100424.3/002")


class TestUnsupportedUF(unittest.TestCase):
    def test_is_valid(self):
        self.assertFalse(ie.is_valid("110042490114", "XX"))

    def test_normalize(self):
        self.assertEqual(ie.normalize("110042490114", "XX"), "110042490114")

    def test_format(self):
        self.assertEqual(ie.format("110042490114", "XX"), "110042490114")


class TestNormalizeAndFormat(unittest.TestCase):
    def test_round_trip(self):
        cases = [
            ("SP", "110.042.490.114", "110042490114"),
            ("RJ", "99.999.99-3", "99999993"),
            ("MG", "062.307.904/0081", "0623079040081"),
            ("BA", "123456-63", "12345663"),
            ("RS", "224/3658792", "2243658792"),
            ("DF", "07.300.001.001-09", "0730000100109"),
        ]
        for uf, formatted, normalized in cases:
            with self.subTest(uf=uf):
                self.assertEqual(ie.normalize(formatted, uf), normalized)
                self.assertEqual(ie.format(normalized, uf), formatted)

    def test_invalid_length_returns_unchanged(self):
        self.assertEqual(ie.format("123", "SP"), "123")


if __name__ == "__main__":
    unittest.main()
