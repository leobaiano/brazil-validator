# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # RO: verified against the official SEFAZ-RO "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html),
    # including its worked example (0000000062521-3). Since 01/08/2000 the
    # format is 13 digits + 1 check digit (the old "município + empresa"
    # layout is superseded, with old registrations re-expressed by
    # zero-padding into the new 13-digit field).
    #
    # The weights cycle 2-9 applied right to left over the 13 digits, i.e.
    # [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other
    # states, a zero remainder maps to check digit 1, not 0 (the source
    # explicitly says "subtract 10" from the 11-or-10 result, rather than
    # mapping straight to 0).
    module Ro
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def calculate_check_digit(base)
        remainder = Mod11.weighted_sum(base, WEIGHTS) % 11
        diff = 11 - remainder

        diff > 9 ? diff - 10 : diff
      end
      private_class_method :calculate_check_digit

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 14

        calculate_check_digit(v[0...13]) == v[13].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless v.length == 14

        "#{v[0...13]}-#{v[13...14]}"
      end
    end
  end
end
