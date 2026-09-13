# frozen_string_literal: true

require_relative "shared"

module BrValidator
  # Validates, normalizes, and formats Brazilian CPF numbers.
  module Cpf
    module_function

    ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
    REPEATED_DIGITS = /\A(\d)\1{10}\z/.freeze
    private_constant :ALLOWED_CHARS, :REPEATED_DIGITS

    # Strips formatting and returns the canonical (digits-only)
    # representation of value.
    def normalize(value)
      Shared.remove_non_digits(value)
    end

    def calculate_check_digit(cpf, weight)
      sum = 0

      cpf.each_char.with_index do |char, i|
        sum += char.to_i * (weight - i)
      end

      remainder = (sum * 10) % 11
      remainder == 10 ? 0 : remainder
    end
    private_class_method :calculate_check_digit

    # Returns true if value is a structurally and check-digit valid CPF.
    #
    # Accepts raw or formatted input but rejects unexpected characters.
    def is_valid?(value)
      return false unless value.match?(ALLOWED_CHARS)

      cpf = normalize(value)

      return false unless cpf.length == 11
      return false if cpf.match?(REPEATED_DIGITS)

      first_digit = calculate_check_digit(cpf[0...9], 10)
      return false unless first_digit == cpf[9].to_i

      second_digit = calculate_check_digit(cpf[0...10], 11)

      second_digit == cpf[10].to_i
    end

    # Returns value as XXX.XXX.XXX-XX.
    #
    # If the normalized value has an invalid length, value is returned
    # unchanged.
    def format(value)
      cpf = normalize(value)

      return value unless cpf.length == 11

      "#{cpf[0...3]}.#{cpf[3...6]}.#{cpf[6...9]}-#{cpf[9...11]}"
    end
  end
end
