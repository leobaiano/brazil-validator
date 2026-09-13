# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # MT: verified against the official SEFAZ-MT "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MT.html),
    # including its worked example (0013000001-9). Format: 10 digits + 1
    # check digit.
    module Mt
      module_function

      ALLOWED_CHARS = /\A[\d\-\s]+\z/.freeze
      WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 11

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[10].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 11

        "#{v[0...10]}-#{v[10...11]}"
      end
    end
  end
end
