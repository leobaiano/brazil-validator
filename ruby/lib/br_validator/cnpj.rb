# frozen_string_literal: true

module BrValidator
  # Validates, normalizes, and formats Brazilian CNPJ numbers.
  #
  # Covers both the traditional numeric format and the alphanumeric format
  # introduced by Receita Federal.
  module Cnpj
    module_function

    ALLOWED_CHARS = %r{\A[A-Za-z0-9.\-/\s]+\z}.freeze
    FORMATTING_CHARS = %r{[.\-/\s]}.freeze
    NORMALIZED_SHAPE = /\A[A-Z0-9]{12}\d{2}\z/.freeze
    private_constant :ALLOWED_CHARS, :FORMATTING_CHARS, :NORMALIZED_SHAPE

    # Strips formatting and uppercases value.
    #
    # A digit-only strip would destroy alphanumeric CNPJ values, so only
    # separator characters are removed.
    def normalize(value)
      value.gsub(FORMATTING_CHARS, "").upcase
    end

    def character_value(char)
      char.ord - 48
    end
    private_class_method :character_value

    def calculate_check_digit(value)
      sum = 0
      weight = value.length == 12 ? 5 : 6

      value.each_char do |char|
        sum += character_value(char) * weight
        weight -= 1
        weight = 9 if weight == 1
      end

      remainder = sum % 11

      return 0 if [0, 1].include?(remainder)

      11 - remainder
    end
    private_class_method :calculate_check_digit

    # Returns true if value is a structurally and check-digit valid CNPJ,
    # numeric or alphanumeric.
    #
    # Accepts raw or formatted input but rejects unexpected characters.
    def is_valid?(value)
      return false unless value.match?(ALLOWED_CHARS)

      cnpj = normalize(value)

      return false unless cnpj.match?(NORMALIZED_SHAPE)

      first_digit = calculate_check_digit(cnpj[0...12])
      return false unless first_digit == cnpj[12].to_i

      second_digit = calculate_check_digit(cnpj[0...13])

      second_digit == cnpj[13].to_i
    end

    # Returns value as XX.XXX.XXX/XXXX-XX.
    #
    # If the normalized value has an invalid length, value is returned
    # unchanged.
    def format(value)
      cnpj = normalize(value)

      return value unless cnpj.length == 14

      "#{cnpj[0...2]}.#{cnpj[2...5]}.#{cnpj[5...8]}/#{cnpj[8...12]}-#{cnpj[12...14]}"
    end
  end
end
