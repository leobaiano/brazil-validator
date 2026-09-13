# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # MS: verified against the official SEFAZ-MS "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the
    # algorithm (which the page does not accompany with a worked numeric
    # example), plus an independently hand-computed regression vector
    # (281234566). Format: 8 digits (always starting with "28" or "50") +
    # 1 check digit.
    module Ms
      module_function

      ALLOWED_CHARS = /\A[\d\s]+\z/.freeze
      WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2].freeze
      private_constant :ALLOWED_CHARS, :WEIGHTS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def valid_prefix?(v)
        %w[28 50].include?(v[0...2])
      end
      private_class_method :valid_prefix?

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless v.length == 9 && valid_prefix?(v)

        Mod11.mod11_check_digit(Mod11.weighted_sum(v, WEIGHTS)) == v[8].to_i
      end

      def format(value)
        normalize(value)
      end
    end
  end
end
