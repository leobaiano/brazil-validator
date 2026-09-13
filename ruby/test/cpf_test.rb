# frozen_string_literal: true

require_relative "test_helper"

class CpfTest < Minitest::Test
  def test_is_valid_accepts_valid
    [
      "529.982.247-25", "52998224725", "529 982 247 25", "111.444.777-35", "935.411.347-80"
    ].each do |v|
      assert BrValidator::Cpf.is_valid?(v), v
    end
  end

  def test_is_valid_rejects_invalid
    [
      "529.982.247-26", "111.444.777-36", "935.411.347-81", "111.111.111-11",
      "123456789", "529.982.247-2A", "           ", "", "529abc982xyz247-25"
    ].each do |v|
      refute BrValidator::Cpf.is_valid?(v), v
    end
  end

  def test_normalize
    assert_equal "52998224725", BrValidator::Cpf.normalize("529.982.247-25")
    assert_equal "52998224725", BrValidator::Cpf.normalize("52998224725")
    assert_equal "52998224725", BrValidator::Cpf.normalize("529 982 247 25")
  end

  def test_format
    assert_equal "529.982.247-25", BrValidator::Cpf.format("52998224725")
    assert_equal "529.982.247-25", BrValidator::Cpf.format("529.982.247-25")
    assert_equal "123", BrValidator::Cpf.format("123")
    assert_equal "529982247", BrValidator::Cpf.format("529982247")
  end
end
