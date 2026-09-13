# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # BA: verified against the official SEFAZ-BA "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html),
    # including its four worked examples (123456-63, 612345-57,
    # 1000003-06 mod-10/mod-11 x 8/9-digit variants).
    #
    # Bahia has two lengths (8 or 9 digits) and, within each, two moduli:
    # módulo 10 when the discriminating digit (the 1st digit for 8-digit
    # IEs, the 2nd for 9-digit IEs) is one of 0,1,2,3,4,5,8, and módulo 11
    # when it is 6, 7 or 9. The last check digit is calculated first (from
    # the base digits alone), then the first check digit is calculated
    # from the base plus that digit.
    module Ba
      module_function

      ALLOWED_CHARS = /\A[\d\-\s]+\z/.freeze
      MOD10_DIGITS = %w[0 1 2 3 4 5 8].freeze
      MOD11_DIGITS = %w[6 7 9].freeze
      private_constant :ALLOWED_CHARS, :MOD10_DIGITS, :MOD11_DIGITS

      def normalize(value)
        Shared.remove_non_digits(value)
      end

      def check_digit_for(sum, use_mod11)
        use_mod11 ? Mod11.mod11_check_digit(sum) : Mod11.mod10_check_digit(sum)
      end
      private_class_method :check_digit_for

      def descending_weights(length)
        (0...length).map { |i| length + 1 - i }
      end
      private_class_method :descending_weights

      def is_valid?(value)
        return false unless value.match?(ALLOWED_CHARS)

        v = normalize(value)

        return false unless [8, 9].include?(v.length)

        discriminant = v.length == 8 ? v[0] : v[1]
        use_mod11 = MOD11_DIGITS.include?(discriminant)

        return false if !use_mod11 && !MOD10_DIGITS.include?(discriminant)

        base_length = v.length - 2
        base = v[0...base_length]
        last_digit = check_digit_for(Mod11.weighted_sum(base, descending_weights(base_length)), use_mod11)

        return false unless last_digit == v[-1].to_i

        base_with_last_digit = base + last_digit.to_s
        first_digit = check_digit_for(
          Mod11.weighted_sum(base_with_last_digit, descending_weights(base_length + 1)), use_mod11
        )

        first_digit == v[-2].to_i
      end

      def format(value)
        v = normalize(value)

        return value unless [8, 9].include?(v.length)

        "#{v[0...-2]}-#{v[-2..]}"
      end
    end
  end
end
