# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # AM: verified against the official SEFAZ-AM "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html).
    # Format: 99.999.999-9 (8 digits + 1 check digit). Unlike most other
    # states, when the weighted sum itself is below 11 the digit is 11
    # minus the sum directly (skipping the modulo step).
    module Am
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def calculate_check_digit(v)
        sum = Mod11.weighted_sum(v, WEIGHTS)

        return 11 - sum if sum < 11

        Mod11.mod11_check_digit(sum)
      end
      private_class_method :calculate_check_digit

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9

        calculate_check_digit(v) == v[8].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 9

        "#{v[0...2]}.#{v[2...5]}.#{v[5...8]}-#{v[8...9]}"
      end
    end
  end
end
