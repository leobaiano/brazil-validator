# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # DF: SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
    # (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was
    # instead cross-verified against two independent secondary sources
    # that agree with each other (cadcobol.com.br's fully worked example,
    # arithmetic re-checked by hand, and mestredocalculo.com.br
    # independently citing the same valid example "07.300.001.001-09").
    # The algorithm is structurally identical to AC's officially-confirmed
    # one (same weight sequences), differing only in the fixed "07" prefix
    # -- strong evidence both derive from the same original SEFAZ
    # documentation.
    #
    # Format: "07" (fixed) + 6 sequence digits + 3 "ordem do
    # estabelecimento" digits (001 = matriz) + 2 check digits = 13 digits
    # total.
    module Df
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

        return false unless v.length == 13 && v.start_with?("07")

        first_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(v, FIRST_DIGIT_WEIGHTS))
        return false unless first_digit == v[11].to_i

        second_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(v, SECOND_DIGIT_WEIGHTS))

        second_digit == v[12].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 13

        "#{v[0...2]}.#{v[2...5]}.#{v[5...8]}.#{v[8...11]}-#{v[11...13]}"
      end
    end
  end
end
