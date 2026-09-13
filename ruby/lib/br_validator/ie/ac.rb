# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # AC: verified against the official SEFAZ-AC "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html),
    # including its worked example (01.004.823/001-12). Format: 11 digits
    # (always starting with "01") + 2 check digits.
    module Ac
      module_function

      ALLOWED_CHARS = %r{\A[\d./\-\s]+\z}.freeze
      FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :FIRST_DIGIT_WEIGHTS, :SECOND_DIGIT_WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 13 && v.start_with?("01")

        first_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(v, FIRST_DIGIT_WEIGHTS))
        return false unless first_digit == v[11].to_i

        second_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(v, SECOND_DIGIT_WEIGHTS))

        second_digit == v[12].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 13

        "#{v[0...2]}.#{v[2...5]}.#{v[5...8]}/#{v[8...11]}-#{v[11...13]}"
      end
    end
  end
end
