# frozen_string_literal: true

module BrValidator
  module Ie
    # Shared by most Inscrição Estadual algorithms (SEFAZ "Roteiro de
    # Crítica" documents): weight each digit, sum the products, then
    # reduce modulo 11.
    #
    # Not part of the public API of brazil-validator.
    module Mod11
      module_function

      def weighted_sum(digits, weights)
        weights.each_with_index.sum { |weight, i| digits[i].to_i * weight }
      end

      # The most common check-digit rule across states: remainder 0 or 1
      # maps to digit 0, otherwise the digit is 11 minus the remainder.
      def mod11_check_digit(sum)
        remainder = sum % 11

        return 0 if remainder <= 1

        11 - remainder
      end

      # Used by Bahia's módulo-10 branch: remainder 0 maps to digit 0,
      # otherwise the digit is 10 minus the remainder.
      def mod10_check_digit(sum)
        remainder = sum % 10

        return 0 if remainder.zero?

        10 - remainder
      end

      # Used by Alagoas and Rio Grande do Norte: the sum is multiplied by
      # 10 before reducing modulo 11, and the remainder *is* the digit
      # directly (a remainder of 10 wraps to 0). Mirrors CPF's check-digit
      # formula.
      def mod11_times_ten_check_digit(sum)
        remainder = (sum * 10) % 11

        remainder == 10 ? 0 : remainder
      end
    end
  end
end
