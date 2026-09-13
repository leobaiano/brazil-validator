# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # GO: verified against the official SEFAZ-GO "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html),
    # including its worked example (10.987.654-7). Format: AB.CDE.FGH-I,
    # where AB must be 10, 11, or 20-29.
    module Go
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def valid_prefix?(v)
        prefix = v[0...2].to_i

        prefix == 10 || prefix == 11 || (20..29).cover?(prefix)
      end
      private_class_method :valid_prefix?

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && valid_prefix?(v)

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[8].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 9

        "#{v[0...2]}.#{v[2...5]}.#{v[5...8]}-#{v[8...9]}"
      end
    end
  end
end
