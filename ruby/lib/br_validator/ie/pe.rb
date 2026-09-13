# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # PE: verified against the official SEFAZ-PE "Roteiro de Crítica da
    # Inscrição Estadual" for the e-Fisco system
    # (sintegra.gov.br/Cad_Estados/cad_PE.html), including its fully
    # worked example (0321418-40). Format: 7 digits + 2 check digits.
    module Pe
      module_function

      ALLOWED_CHARS = /\A[\d\-\s]+\z/.freeze
      FIRST_DIGIT_WEIGHTS = [8, 7, 6, 5, 4, 3, 2].freeze
      SECOND_DIGIT_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :FIRST_DIGIT_WEIGHTS, :SECOND_DIGIT_WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9

        base = v[0...7]
        first_digit = Mod11.mod11_check_digit(Mod11.weighted_sum(base, FIRST_DIGIT_WEIGHTS))

        return false unless first_digit == v[7].to_i

        second_digit = Mod11.mod11_check_digit(
          Mod11.weighted_sum(base + first_digit.to_s, SECOND_DIGIT_WEIGHTS)
        )

        second_digit == v[8].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 9

        "#{v[0...7]}-#{v[7...9]}"
      end
    end
  end
end
