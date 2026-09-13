"""Checks this Python implementation against specification/*/vectors.json,
the language-independent test vectors generated from the TypeScript
implementation. If this passes, the Python port behaves identically to
TypeScript (and to the Go port) for every vector on file.
"""

import json
import unittest
from pathlib import Path

from br_validator import cep, cnpj, cpf, email, ie, phone, pix

SPEC_DIR = Path(__file__).resolve().parents[2] / "specification"


def load_vectors(name):
    with open(SPEC_DIR / name / "vectors.json", encoding="utf-8") as f:
        return json.load(f)


class TestCPF(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("cpf"):
            with self.subTest(input=v["input"]):
                self.assertEqual(cpf.is_valid(v["input"]), v["valid"])
                self.assertEqual(cpf.normalize(v["input"]), v["normalized"])
                self.assertEqual(cpf.format(v["input"]), v["formatted"])


class TestCNPJ(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("cnpj"):
            with self.subTest(input=v["input"]):
                self.assertEqual(cnpj.is_valid(v["input"]), v["valid"])
                self.assertEqual(cnpj.normalize(v["input"]), v["normalized"])
                self.assertEqual(cnpj.format(v["input"]), v["formatted"])


class TestCEP(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("cep"):
            with self.subTest(input=v["input"]):
                self.assertEqual(cep.is_valid(v["input"]), v["valid"])
                self.assertEqual(cep.normalize(v["input"]), v["normalized"])
                self.assertEqual(cep.format(v["input"]), v["formatted"])


class TestPhone(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("phone"):
            with self.subTest(input=v["input"]):
                self.assertEqual(phone.is_valid(v["input"]), v["valid"])
                self.assertEqual(phone.normalize(v["input"]), v["normalized"])
                self.assertEqual(phone.format(v["input"]), v["formatted"])


class TestEmail(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("email"):
            with self.subTest(input=v["input"]):
                self.assertEqual(email.is_valid(v["input"]), v["valid"])
                self.assertEqual(email.normalize(v["input"]), v["normalized"])
                self.assertEqual(email.format(v["input"]), v["formatted"])


class TestPIX(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("pix"):
            with self.subTest(input=v["input"]):
                want_key_type = pix.KeyType(v["keyType"]) if v["keyType"] else None
                self.assertEqual(pix.get_key_type(v["input"]), want_key_type)
                self.assertEqual(pix.is_valid(v["input"]), v["valid"])
                self.assertEqual(pix.normalize(v["input"]), v["normalized"])
                self.assertEqual(pix.format(v["input"]), v["formatted"])


class TestIE(unittest.TestCase):
    def test_vectors(self):
        for v in load_vectors("ie"):
            with self.subTest(input=v["input"], uf=v["uf"]):
                self.assertEqual(ie.is_valid(v["input"], v["uf"]), v["valid"])
                self.assertEqual(ie.normalize(v["input"], v["uf"]), v["normalized"])
                self.assertEqual(ie.format(v["input"], v["uf"]), v["formatted"])


if __name__ == "__main__":
    unittest.main()
