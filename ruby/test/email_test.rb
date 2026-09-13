# frozen_string_literal: true

require_relative "test_helper"

class EmailTest < Minitest::Test
  def test_is_valid_accepts_valid
    [
      "user@example.com", "user@mail.example.com", "user+tag@example.com", "User@Example.COM",
      "  user@example.com  ", "first.last@sub.example.com.br", "a@b.co"
    ].each do |v|
      assert BrValidator::Email.is_valid?(v), v
    end
  end

  def test_is_valid_rejects_invalid
    [
      "userexample.com", "user@example", "user@@example.com", "us er@example.com",
      "user<>@example.com", "", "        ", "user@.com",
      "#{'a' * 250}@example.com", "#{'a' * 65}@example.com"
    ].each do |v|
      refute BrValidator::Email.is_valid?(v), v
    end
  end

  def test_normalize
    assert_equal "user@example.com", BrValidator::Email.normalize("  user@example.com  ")
    assert_equal "user@example.com", BrValidator::Email.normalize("User@Example.COM")
    assert_equal "user@example.com", BrValidator::Email.normalize("user@example.com")
  end

  def test_format
    assert_equal "user@example.com", BrValidator::Email.format("  User@Example.COM  ")
  end
end
