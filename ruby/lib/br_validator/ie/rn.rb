# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # RN: verified against the official SEFAZ-RN "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html),
    # including both of its worked examples (20.040.040-1 and
    # 20.0.040.040-0). Format: always starts with "20", followed by either
    # 7 or 8 more digits, plus 1 check digit (9 or 10 digits total, both
    # still valid today per the official page).
    module Rn
      module_function

      ALLOWED_CHARS = /\A[\d.\-\s]+\z/.freeze
      private_constant :ALLOWED_CHARS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def weights_for(base_length)
        (0...base_length).map { |i| base_length + 1 - i }
      end
      private_class_method :weights_for

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless [9, 10].include?(v.length) && v.start_with?("20")

        base = v[0...-1]
        check_digit = Mod11.mod11_times_ten_check_digit(
          Mod11.weighted_sum(base, weights_for(base.length))
        )

        check_digit == v[-1].to_i
      end

      def format(value)
        v = normalize(value)

        case v.length
        when 9
          "#{v[0...2]}.#{v[2...5]}.#{v[5...8]}-#{v[8...9]}"
        when 10
          "#{v[0...2]}.#{v[2...3]}.#{v[3...6]}.#{v[6...9]}-#{v[9...10]}"
        else
          value
        end
      end
    end
  end
end
