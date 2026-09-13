# frozen_string_literal: true

require_relative "../shared"
require_relative "mod11"

module BrValidator
  module Ie
    # SP: verified against the official SEFAZ-SP "Roteiro de Crítica da
    # Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html),
    # including both of its worked examples: the standard
    # industrial/commercial format (110.042.490.114) and the "Produtor
    # Rural" format (P-01100424.3/002).
    #
    # Note: the source restates the Produtor Rural example at the very end
    # as "P-011000424.3/002" (14 characters) -- this contradicts both the
    # document's own "13 caracteres" rule and its worked calculation
    # (which sums exactly 8 digits to 91, matching the 13-character form).
    # Treated as a typo in the source; the 13-character form is what this
    # module expects.
    module Sp
      module_function

      STANDARD_ALLOWED_CHARS = /\A[\d.\s]+\z/.freeze
      PRODUTOR_RURAL_ALLOWED = %r{\A[Pp\d.\-/\s]+\z}.freeze
      FORMATTING_CHARS = %r{[.\-/\s]}.freeze
      PRODUTOR_RURAL_PREFIX = /\A\s*[Pp]/.freeze

      STANDARD_FIRST_DIGIT_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10].freeze
      STANDARD_SECOND_DIGIT_WEIGHTS = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2].freeze
      PRODUTOR_RURAL_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10].freeze
      private_constant :STANDARD_ALLOWED_CHARS, :PRODUTOR_RURAL_ALLOWED, :FORMATTING_CHARS,
                        :PRODUTOR_RURAL_PREFIX, :STANDARD_FIRST_DIGIT_WEIGHTS,
                        :STANDARD_SECOND_DIGIT_WEIGHTS, :PRODUTOR_RURAL_WEIGHTS

      def calculate_check_digit(digits, weights)
        sum = Mod11.weighted_sum(digits, weights)

        sum % 11 == 10 ? 0 : sum % 11
      end
      private_class_method :calculate_check_digit

      def produtor_rural?(value)
        value.match?(PRODUTOR_RURAL_PREFIX)
      end
      private_class_method :produtor_rural?

      def normalize_standard(value)
        Shared.remove_non_digits(value)
      end
      private_class_method :normalize_standard

      def valid_standard?(value)
        return false unless value.match?(STANDARD_ALLOWED_CHARS)

        v = normalize_standard(value)

        return false unless v.length == 12

        first_digit = calculate_check_digit(v, STANDARD_FIRST_DIGIT_WEIGHTS)
        return false unless first_digit == v[8].to_i

        second_digit = calculate_check_digit(v, STANDARD_SECOND_DIGIT_WEIGHTS)

        second_digit == v[11].to_i
      end
      private_class_method :valid_standard?

      def format_standard(value)
        v = normalize_standard(value)

        return value unless v.length == 12

        "#{v[0...3]}.#{v[3...6]}.#{v[6...9]}.#{v[9...12]}"
      end
      private_class_method :format_standard

      # Format: P0MMMSSSSD000 (13 characters) -- "P" (fixed) + "0" (fixed)
      # + 3 município digits + 4 sequence digits + 1 check digit + 3
      # unused digits.
      def normalize_produtor_rural(value)
        value.gsub(FORMATTING_CHARS, "").upcase
      end
      private_class_method :normalize_produtor_rural

      def valid_produtor_rural?(value)
        return false unless value.match?(PRODUTOR_RURAL_ALLOWED)

        v = normalize_produtor_rural(value)

        return false unless v.length == 13 && v[0] == "P" && v[1] == "0"

        base = v[1...9]
        check_digit = calculate_check_digit(base, PRODUTOR_RURAL_WEIGHTS)

        check_digit == v[9].to_i
      end
      private_class_method :valid_produtor_rural?

      def format_produtor_rural(value)
        v = normalize_produtor_rural(value)

        return value unless v.length == 13

        "P-#{v[1...9]}.#{v[9...10]}/#{v[10...13]}"
      end
      private_class_method :format_produtor_rural

      def is_valid?(value)
        produtor_rural?(value) ? valid_produtor_rural?(value) : valid_standard?(value)
      end

      def normalize(value)
        produtor_rural?(value) ? normalize_produtor_rural(value) : normalize_standard(value)
      end

      def format(value)
        produtor_rural?(value) ? format_produtor_rural(value) : format_standard(value)
      end
    end
  end
end
