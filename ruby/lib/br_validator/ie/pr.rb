# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # PR: verified against the official SEFAZ-PR "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html),
    # including its fully worked example (123.45678-50), and cross-checked
    # against the reference Visual Basic routine published on the same
    # page. Format: 8 digits + 2 check digits.
    module Pr
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      FIRST_DIGIT_WEIGHTS = [3, 2, 7, 6, 5, 4, 3, 2].freeze
      SECOND_DIGIT_WEIGHTS = [4, 3, 2, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :FIRST_DIGIT_WEIGHTS, :SECOND_DIGIT_WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 10

        base = v[0...8]
        first_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(base, FIRST_DIGIT_WEIGHTS))

        return false unless first_digit == v[8].to_i

        second_digit = Mod11.mod11_check_digit(
          Mod11.weighted_sum(base + first_digit.to_s, SECOND_DIGIT_WEIGHTS)
        )

        second_digit == v[9].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 10

        "#{v[0...3]}.#{v[3...8]}-#{v[8...10]}"
      end
    end
  end
end
