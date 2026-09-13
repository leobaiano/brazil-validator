# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # SC: verified against the official SEFAZ-SC "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_SC.html),
    # including its worked example (251.040.852). Format: 8 digits + 1
    # check digit.
    module Sc
      module_function

      ALLOWED_CHARS = /\A[\d.\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[8].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 9

        "#{v[0...3]}.#{v[3...6]}.#{v[6...9]}"
      end
    end
  end
end
