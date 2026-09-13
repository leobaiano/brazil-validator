# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # RR: verified against the official SEFAZ-RR "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RR.html),
    # including its worked example (24006153-6) and the ten additional
    # valid numbers it lists. Format: "24" (fixed) + 6 sequence digits + 1
    # check digit = 9 digits total. Unlike every other state, the check
    # digit uses módulo 9, and the weights are the digit's own 1-based
    # position (ascending, not descending).
    module Rr
      module_function

      ALLOWED_CHARS = /\A[\d\-\s]+\z/.freeze
      WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && v.start_with?("24")

        check_digit = Mod11.weighted_sum(v, WEIGHTS) % 9

        check_digit == v[8].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 9

        "#{v[0...8]}-#{v[8...9]}"
      end
    end
  end
end
