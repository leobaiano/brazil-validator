# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # RJ: verified against the official SEFAZ-RJ "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the
    # check-digit rule, and cross-checked against a worked example
    # (99.999.99-3) for the weights, which the Sintegra page itself does
    # not enumerate.
    module Rj
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      WEIGHTS = [2, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def calculate_check_digit(v)
        sum = Mod11.weighted_sum(v, WEIGHTS)
        remainder = sum % 11

        return 0 if remainder <= 1

        11 - remainder
      end
      private_class_method :calculate_check_digit

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 8

        calculate_check_digit(v) == v[7].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 8

        "#{v[0...2]}.#{v[2...5]}.#{v[5...7]}-#{v[7...8]}"
      end
    end
  end
end
