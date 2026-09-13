# frozen_string_literal: true

require_relative "test_helper"

class PhoneTest < Minitest::Test
  def test_is_valid_accepts_valid
    [
      "(11) 91234-5678", "11912345678", "(11) 2345-6789", "1123456789", "(21) 2345-6789",
      "11987654321", "8534567890"
    ].each do |v|
      assert BrValidator::Phone.is_valid?(v), v
    end
  end

  def test_is_valid_rejects_invalid
    [
      "(00) 91234-5678", "(20) 1234-5678", "(29) 91234-5678", "11812345678", "1161234567",
      "1191234567", "111234567", "119123456789", "(11) 9ABC-5678", "11+91234-5678", "",
      "        ", "1234", "11a12345678", "119123456789012"
    ].each do |v|
      refute BrValidator::Phone.is_valid?(v), v
    end
  end

  def test_normalize
    assert_equal "11912345678", BrValidator::Phone.normalize("(11) 91234-5678")
    assert_equal "1123456789", BrValidator::Phone.normalize("(11) 2345-6789")
    assert_equal "11912345678", BrValidator::Phone.normalize("11912345678")
  end

  def test_format
    assert_equal "(11) 91234-5678", BrValidator::Phone.format("11912345678")
    assert_equal "(11) 2345-6789", BrValidator::Phone.format("1123456789")
    assert_equal "(11) 91234-5678", BrValidator::Phone.format("(11) 91234-5678")
    assert_equal "123", BrValidator::Phone.format("123")
  end
end
