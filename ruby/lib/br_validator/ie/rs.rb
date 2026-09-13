# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # RS: verified against the official SEFAZ-RS "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RS.html),
    # including its worked example (224/3658792). Format: 3 digits
    # (município) + 6 digits (empresa) + 1 check digit = 10 digits total.
    module Rs
      module_function

      ALLOWED_CHARS = %r{\A[\d/\s]+\z}.freeze
      WEIGHTS = [2, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 10

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[9].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 10

        "#{v[0...3]}/#{v[3...10]}"
      end
    end
  end
end
