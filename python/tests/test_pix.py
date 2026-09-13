import unittest

from br_validator import pix


class TestGetKeyType(unittest.TestCase):
    def test_get_key_type(self):
        cases = {
            "52998224725": pix.KeyType.CPF,
            "11222333000181": pix.KeyType.CNPJ,
            "user@example.com": pix.KeyType.EMAIL,
            "+5511987654321": pix.KeyType.PHONE,
            "123e4567-e89b-12d3-a456-426655440000": pix.KeyType.EVP,
            "not-a-pix-key": None,
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(pix.get_key_type(value), expected)


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        values = [
            "52998224725",
            "11222333000181",
            "user@example.com",
            "User@Example.COM",
            "+5511987654321",
            "+55 (11) 98765-4321",
            "123e4567-e89b-12d3-a456-426655440000",
            "123E4567-E89B-12D3-A456-426655440000",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertTrue(pix.is_valid(value))

    def test_invalid(self):
        values = [
            "529.982.247-25",
            "52998224700",
            "12ABC34501DE35",
            "11987654321",
            "+5500987654321",
            "+551187654321",
            "123456789",
            "123e4567-e89b-12d3-426655440000",
            "not a pix key!!",
            "",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertFalse(pix.is_valid(value))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        cases = {
            "52998224725": "52998224725",
            "User@Example.COM": "user@example.com",
            "+55 (11) 98765-4321": "+5511987654321",
            "123E4567-E89B-12D3-A456-426655440000": "123e4567-e89b-12d3-a456-426655440000",
            "not-a-pix-key": "not-a-pix-key",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(pix.normalize(value), expected)


class TestFormat(unittest.TestCase):
    def test_format(self):
        cases = {
            "52998224725": "529.982.247-25",
            "11222333000181": "11.222.333/0001-81",
            "User@Example.COM": "user@example.com",
            "+5511987654321": "+55 (11) 98765-4321",
            "123E4567-E89B-12D3-A456-426655440000": "123e4567-e89b-12d3-a456-426655440000",
            "not-a-pix-key": "not-a-pix-key",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(pix.format(value), expected)


if __name__ == "__main__":
    unittest.main()
