# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # AL: verified against the official SEFAZ-AL "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html),
    # including its worked example (24000004 -> check digit 8, i.e.
    # 240000048).
    #
    # Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5
    # sequence digits + 1 check digit = 9 digits total. No official
    # punctuation mask is published, so format returns the plain digits.
    module Al
      module_function

      ALLOWED_CHARS = /\A[\d\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      VALID_TYPE_DIGITS = %w[0 3 5 7 8].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS, :VALID_TYPE_DIGITS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && v.start_with?("24")
        return false unless VALID_TYPE_DIGITS.include?(v[2])

        check_digit = Mod11.mod11_times_ten_check_digit(Mod11.weighted_sum(v, WEIGHTS))

        check_digit == v[8].to_i
      end

      def format(value)
        normalize(value)
      end
    end
  end
end
