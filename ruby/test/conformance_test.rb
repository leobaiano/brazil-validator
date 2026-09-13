# frozen_string_literal: true

require_relative "test_helper"
require "json"

# Checks this Ruby implementation against specification/*/vectors.json,
# the language-independent test vectors generated from the TypeScript
# implementation. If this passes, the Ruby port behaves identically to
# TypeScript (and to the Go, Python, and Java ports) for every vector on
# file.
class ConformanceTest < Minitest::Test
  SPEC_DIR = File.expand_path("../../specification", __dir__)

  def load_vectors(name)
    JSON.parse(File.read(File.join(SPEC_DIR, name, "vectors.json")))
  end

  def test_cpf
    load_vectors("cpf").each do |v|
      input = v["input"]
      assert_equal v["valid"], BrValidator::Cpf.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Cpf.normalize(input), input
      assert_equal v["formatted"], BrValidator::Cpf.format(input), input
    end
  end

  def test_cnpj
    load_vectors("cnpj").each do |v|
      input = v["input"]
      assert_equal v["valid"], BrValidator::Cnpj.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Cnpj.normalize(input), input
      assert_equal v["formatted"], BrValidator::Cnpj.format(input), input
    end
  end

  def test_cep
    load_vectors("cep").each do |v|
      input = v["input"]
      assert_equal v["valid"], BrValidator::Cep.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Cep.normalize(input), input
      assert_equal v["formatted"], BrValidator::Cep.format(input), input
    end
  end

  def test_phone
    load_vectors("phone").each do |v|
      input = v["input"]
      assert_equal v["valid"], BrValidator::Phone.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Phone.normalize(input), input
      assert_equal v["formatted"], BrValidator::Phone.format(input), input
    end
  end

  def test_email
    load_vectors("email").each do |v|
      input = v["input"]
      assert_equal v["valid"], BrValidator::Email.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Email.normalize(input), input
      assert_equal v["formatted"], BrValidator::Email.format(input), input
    end
  end

  def test_pix
    load_vectors("pix").each do |v|
      input = v["input"]
      want_key_type = v["keyType"]&.downcase&.to_sym
      if want_key_type.nil?
        assert_nil BrValidator::Pix.key_type(input), input
      else
        assert_equal want_key_type, BrValidator::Pix.key_type(input), input
      end
      assert_equal v["valid"], BrValidator::Pix.is_valid?(input), input
      assert_equal v["normalized"], BrValidator::Pix.normalize(input), input
      assert_equal v["formatted"], BrValidator::Pix.format(input), input
    end
  end

  def test_ie
    load_vectors("ie").each do |v|
      input = v["input"]
      uf = v["uf"]
      assert_equal v["valid"], BrValidator::Ie.is_valid?(input, uf), "#{input} #{uf}"
      assert_equal v["normalized"], BrValidator::Ie.normalize(input, uf), "#{input} #{uf}"
      assert_equal v["formatted"], BrValidator::Ie.format(input, uf), "#{input} #{uf}"
    end
  end
end
