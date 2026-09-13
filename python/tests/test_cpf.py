import unittest

from br_validator import cpf


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        for value in [
            "529.982.247-25",
            "52998224725",
            "529 982 247 25",
            "111.444.777-35",
            "935.411.347-80",
        ]:
            with self.subTest(value=value):
                self.assertTrue(cpf.is_valid(value))

    def test_invalid(self):
        for value in [
            "529.982.247-26",
            "111.444.777-36",
            "935.411.347-81",
            "111.111.111-11",
            "123456789",
            "529.982.247-2A",
            "           ",
            "",
            "529abc982xyz247-25",
        ]:
            with self.subTest(value=value):
                self.assertFalse(cpf.is_valid(value))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        cases = {
            "529.982.247-25": "52998224725",
            "52998224725": "52998224725",
            "529 982 247 25": "52998224725",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(cpf.normalize(value), expected)


class TestFormat(unittest.TestCase):
    def test_format(self):
        cases = {
            "52998224725": "529.982.247-25",
            "529.982.247-25": "529.982.247-25",
            "123": "123",
            "529982247": "529982247",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(cpf.format(value), expected)


if __name__ == "__main__":
    unittest.main()
