# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # AP: verified against the official SEFAZ-AP "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html),
    # including its worked example (030123459).
    #
    # Format: "03" (fixed) + 6 sequence digits + 1 check digit = 9 digits
    # total. Unlike other states, the weighted sum starts from a constant
    # "p" that depends on the numeric range of the registration, and a
    # zero remainder maps to a range-dependent digit "d" instead of always
    # 0.
    module Ap
      module_function

      ALLOWED_CHARS = /\A[\d\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def resolve_constants(base)
        return [5, 0] if base <= 3_017_000
        return [9, 1] if base <= 3_019_022

        [0, 0]
      end
      private_class_method :resolve_constants

      def calculate_check_digit(v)
        base = v[0...8]
        p, d = resolve_constants(base.to_i)
        sum = p + Mod11.weighted_sum(base, WEIGHTS)
        remainder = sum % 11

        return 0 if remainder == 1
        return d if remainder.zero?

        11 - remainder
      end
      private_class_method :calculate_check_digit

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && v.start_with?("03")

        calculate_check_digit(v) == v[8].to_i
      end

      def format(value)
        normalize(value)
      end
    end
  end
end
