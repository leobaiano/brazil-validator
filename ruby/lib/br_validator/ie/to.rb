# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # TO: verified against the official SEFAZ-TO "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html),
    # including its worked example (29010227836). Format: 11 digits, where
    # positions 3-4 hold a fixed "tipo" code (01 Produtor Rural, 02
    # Indústria e Comércio, 03 Empresas Rudimentares, 99 Cadastro Antigo)
    # that is excluded from the check-digit calculation, and position 11
    # is the check digit.
    module To
      module_function

      ALLOWED_CHARS = /\A[\d\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      VALID_TYPE_CODES = %w[01 02 03 99].freeze
      # 1-based positions used in the check-digit calculation (positions
      # 3-4 are skipped).
      DIGIT_POSITIONS = [1, 2, 5, 6, 7, 8, 9, 10].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS, :VALID_TYPE_CODES, :DIGIT_POSITIONS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 11 && VALID_TYPE_CODES.include?(v[2...4])

        sum = DIGIT_POSITIONS.each_with_index.sum do |pos, i|
          v[pos - 1].to_i * WEIGHTS[i]
        end

        Mod11.mod11_check_digit(sum) == v[10].to_i
      end

      def format(value)
        normalize(value)
      end
    end
  end
end
