import unittest

from br_validator import phone


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        values = [
            "(11) 91234-5678",
            "11912345678",
            "(11) 2345-6789",
            "1123456789",
            "(21) 2345-6789",
            "11987654321",
            "8534567890",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertTrue(phone.is_valid(value))

    def test_invalid(self):
        values = [
            "(00) 91234-5678",
            "(20) 1234-5678",
            "(29) 91234-5678",
            "11812345678",
            "1161234567",
            "1191234567",
            "111234567",
            "119123456789",
            "(11) 9ABC-5678",
            "11+91234-5678",
            "",
            "        ",
            "1234",
            "11a12345678",
            "119123456789012",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertFalse(phone.is_valid(value))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        cases = {
            "(11) 91234-5678": "11912345678",
            "(11) 2345-6789": "1123456789",
            "11912345678": "11912345678",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(phone.normalize(value), expected)


class TestFormat(unittest.TestCase):
    def test_format(self):
        cases = {
            "11912345678": "(11) 91234-5678",
            "1123456789": "(11) 2345-6789",
            "(11) 91234-5678": "(11) 91234-5678",
            "123": "123",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(phone.format(value), expected)


if __name__ == "__main__":
    unittest.main()
