# frozen_string_literal: true

require_relative "test_helper"

class CepTest < Minitest::Test
  def test_is_valid_accepts_valid
    ["01310-100", "01310100", "11111-111", "70002-900", "20040-020"].each do |v|
      assert BrValidator::Cep.is_valid?(v), v
    end
  end

  def test_is_valid_rejects_invalid
    [
      "0131010", "013101000", "01310-10A", "013abc10-100", "", "        ", "1234", "abcde-fgh"
    ].each do |v|
      refute BrValidator::Cep.is_valid?(v), v
    end
  end

  def test_normalize
    assert_equal "01310100", BrValidator::Cep.normalize("01310-100")
  end

  def test_format
    assert_equal "01310-100", BrValidator::Cep.format("01310100")
    assert_equal "01310-100", BrValidator::Cep.format("01310-100")
    assert_equal "123", BrValidator::Cep.format("123")
  end
end
