import unittest

from br_validator import cep


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        for value in ["01310-100", "01310100", "11111-111", "70002-900", "20040-020"]:
            with self.subTest(value=value):
                self.assertTrue(cep.is_valid(value))

    def test_invalid(self):
        for value in [
            "0131010",
            "013101000",
            "01310-10A",
            "013abc10-100",
            "",
            "        ",
            "1234",
            "abcde-fgh",
        ]:
            with self.subTest(value=value):
                self.assertFalse(cep.is_valid(value))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        self.assertEqual(cep.normalize("01310-100"), "01310100")


class TestFormat(unittest.TestCase):
    def test_format(self):
        cases = {"01310100": "01310-100", "01310-100": "01310-100", "123": "123"}
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(cep.format(value), expected)


if __name__ == "__main__":
    unittest.main()
