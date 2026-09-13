# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # MG: verified against the official SEFAZ-MG "Roteiro de Crítica da
    # Inscrição Estadual" (mirrored at
    # sintegra.gov.br/Cad_Estados/cad_MG.html), including its fully worked
    # example (062.307.904/0081).
    #
    # Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A =
    # município code, B = registration number, C = establishment order, D
    # = check digits.
    module Mg
      module_function

      ALLOWED_CHARS = %r{\A[\d./\s]+\z}.freeze
      FIRST_DIGIT_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2].freeze
      SECOND_DIGIT_WEIGHTS = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :FIRST_DIGIT_WEIGHTS, :SECOND_DIGIT_WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def sum_of_digits(value)
        value.digits.sum
      end
      private_class_method :sum_of_digits

      # D1 equalizes the field widths by inserting a "0" right after the
      # município code, then sums the *digits* of each weighted product
      # (not the products themselves) before completing to the next
      # multiple of ten.
      def calculate_first_digit(base)
        with_inserted_zero = "#{base[0...3]}0#{base[3..]}"

        digit_sum = FIRST_DIGIT_WEIGHTS.each_with_index.sum do |weight, i|
          sum_of_digits(with_inserted_zero[i].to_i * weight)
        end

        remainder = digit_sum % 10

        return 0 if remainder.zero?

        10 - remainder
      end
      private_class_method :calculate_first_digit

      # D2 uses the original (un-padded) base plus D1, and sums the
      # weighted products directly, following the general módulo 11
      # remainder rule.
      def calculate_second_digit(base, first_digit)
        with_first_digit = "#{base}#{first_digit}"

        sum = Mod11.weighted_sum(with_first_digit, SECOND_DIGIT_WEIGHTS)
        remainder = sum % 11

        return 0 if remainder <= 1

        11 - remainder
      end
      private_class_method :calculate_second_digit

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 13

        base = v[0...11]
        first_digit = calculate_first_digit(base)

        return false unless first_digit == v[11].to_i

        second_digit = calculate_second_digit(base, first_digit)

        second_digit == v[12].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 13

        "#{v[0...3]}.#{v[3...6]}.#{v[6...9]}/#{v[9...13]}"
      end
    end
  end
end
