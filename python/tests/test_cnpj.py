import unittest

from br_validator import cnpj


class TestIsValidNumeric(unittest.TestCase):
    def test_valid(self):
        values = [
            "11.222.333/0001-81",
            "11222333000181",
            "00.777.723/0001-00",
            "00.777.723/1476-23",
            "00.777.723/2476-87",
            "00.777.723/3229-99",
            "00.777.723/4519-69",
            "00.777.723/0751-00",
            "42.755.665/0001-55",
            "42.755.665/7618-65",
            "42.755.665/2428-33",
            "42.755.665/6247-95",
            "42.755.665/7222-90",
            "42.755.665/8166-00",
            "85.333.762/0001-62",
            "85.333.762/1873-00",
            "85.333.762/4083-23",
            "85.333.762/1128-07",
            "85.333.762/2682-11",
            "85.333.762/1336-34",
            "04.769.491/0001-90",
            "57.847.140/0001-17",
            "18.405.334/0001-00",
            "78.598.990/0001-07",
            "98.139.666/0001-20",
            "74.200.778/0001-80",
            "49.941.793/0001-32",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertTrue(cnpj.is_valid(value))

    def test_invalid(self):
        values = [
            "11.222.333/0001-82",
            "11.111.111/1111-11",
            "1122233300018",
            "11.222.333/@001-81",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertFalse(cnpj.is_valid(value))


class TestIsValidAlphanumeric(unittest.TestCase):
    # Generated with Receita Federal's official simulator:
    # https://servicos.receitafederal.gov.br/servico/cnpj-alfa/simular
    def test_valid(self):
        values = [
            "12.ABC.345/01DE-35",
            "HD.D6E.N85/0001-38",
            "P4.W9Z.N4E/0001-47",
            "VJ.AGE.C9J/0001-46",
            "CJ.TLM.0JM/0001-88",
            "CJ.TLM.0JM/JPPZ-15",
            "CJ.TLM.0JM/1RD1-50",
            "CJ.TLM.0JM/HSWB-47",
            "CJ.TLM.0JM/0P56-99",
            "YG.8DJ.YZK/0001-57",
            "YG.8DJ.YZK/6JW7-66",
            "YG.8DJ.YZK/AX68-35",
            "GG.CBW.BAD/0001-94",
            "GG.CBW.BAD/PWRR-99",
            "GG.CBW.BAD/0K1T-41",
            "GG.CBW.BAD/L1YA-78",
            "GG.CBW.BAD/WLR5-06",
        ]
        for value in values:
            with self.subTest(value=value):
                self.assertTrue(cnpj.is_valid(value))

    def test_tampered_check_digit(self):
        self.assertFalse(cnpj.is_valid("HD.D6E.N85/0001-39"))


class TestNormalize(unittest.TestCase):
    def test_normalize(self):
        cases = {
            "11.222.333/0001-81": "11222333000181",
            "11222333000181": "11222333000181",
            "12.ABC.345/01DE-35": "12ABC34501DE35",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(cnpj.normalize(value), expected)


class TestFormat(unittest.TestCase):
    def test_format(self):
        cases = {
            "11222333000181": "11.222.333/0001-81",
            "11.222.333/0001-81": "11.222.333/0001-81",
            "123": "123",
            "12ABC34501DE35": "12.ABC.345/01DE-35",
        }
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(cnpj.format(value), expected)


if __name__ == "__main__":
    unittest.main()
