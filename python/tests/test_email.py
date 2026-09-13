import unittest

from br_validator import email


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        values = [
            "user@example.com",
            "user@mail.example.com",
            "user+tag@example.com",
            "User@Example.COM",
            "  user@example.com  ",
            "first.last@sub.example.com.br",
            "a@b.co",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertTrue(email.is_valid(value))

    def test_invalid(self):
        values = [
            "userexample.com",
            "user@example",
            "user@@example.com",
            "us er@example.com",
            "user<>@example.com",
            "",
            "        ",
            "user@.com",
            "a" * 250 + "@example.com",
            "a" * 65 + "@example.com",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertFalse(email.is_valid(value))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        cases = {
            "  user@example.com  ": "user@example.com",
            "User@Example.COM": "user@example.com",
            "user@example.com": "user@example.com",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(email.normalize(value), expected)


class TestFormat(unittest.TestCase):
    def test_format(self):
        self.assertEqual(email.format("  User@Example.COM  "), "user@example.com")


if __name__ == "__main__":
    unittest.main()
