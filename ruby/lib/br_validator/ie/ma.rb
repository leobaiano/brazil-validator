# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # MA: verified against the official SEFAZ-MA "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MA.html),
    # including its worked example (120000385).
    #
    # Format: "12" (fixed) + 6 sequence digits + 1 check digit = 9 digits
    # total. No official punctuation mask is published, so format returns
    # plain digits.
    module Ma
      module_function

      ALLOWED_CHARS = /\A[\d\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && v.start_with?("12")

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[8].to_i
      end

      def format(value)
        normalize(value)
      end
    end
  end
end
