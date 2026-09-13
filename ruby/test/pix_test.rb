# frozen_string_literal: true

require_relative "test_helper"

class PixTest < Minitest::Test
  def test_key_type
    assert_equal :cpf, BrValidator::Pix.key_type("52998224725")
    assert_equal :cnpj, BrValidator::Pix.key_type("11222333000181")
    assert_equal :email, BrValidator::Pix.key_type("user@example.com")
    assert_equal :phone, BrValidator::Pix.key_type("+5511987654321")
    assert_equal :evp, BrValidator::Pix.key_type("123e4567-e89b-12d3-a456-426655440000")
    assert_nil BrValidator::Pix.key_type("not-a-pix-key")
  end

  def test_is_valid_accepts_valid
    [
      "52998224725", "11222333000181", "user@example.com", "User@Example.COM",
      "+5511987654321", "+55 (11) 98765-4321",
      "123e4567-e89b-12d3-a456-426655440000", "123E4567-E89B-12D3-A456-426655440000"
    ].each do |v|
      assert BrValidator::Pix.is_valid?(v), v
    end
  end

  def test_is_valid_rejects_invalid
    [
      "529.982.247-25", "52998224700", "12ABC34501DE35", "11987654321", "+5500987654321",
      "+551187654321", "123456789", "123e4567-e89b-12d3-426655440000", "not a pix key!!", ""
    ].each do |v|
      refute BrValidator::Pix.is_valid?(v), v
    end
  end

  def test_normalize
    assert_equal "52998224725", BrValidator::Pix.normalize("52998224725")
    assert_equal "user@example.com", BrValidator::Pix.normalize("User@Example.COM")
    assert_equal "+5511987654321", BrValidator::Pix.normalize("+55 (11) 98765-4321")
    assert_equal(
      "123e4567-e89b-12d3-a456-426655440000",
      BrValidator::Pix.normalize("123E4567-E89B-12D3-A456-426655440000")
    )
    assert_equal "not-a-pix-key", BrValidator::Pix.normalize("not-a-pix-key")
  end

  def test_format
    assert_equal "529.982.247-25", BrValidator::Pix.format("52998224725")
    assert_equal "11.222.333/0001-81", BrValidator::Pix.format("11222333000181")
    assert_equal "user@example.com", BrValidator::Pix.format("User@Example.COM")
    assert_equal "+55 (11) 98765-4321", BrValidator::Pix.format("+5511987654321")
    assert_equal(
      "123e4567-e89b-12d3-a456-426655440000",
      BrValidator::Pix.format("123E4567-E89B-12D3-A456-426655440000")
    )
    assert_equal "not-a-pix-key", BrValidator::Pix.format("not-a-pix-key")
  end
end
