# frozen_string_literal: true

require_relative "shared"

module BrValidator
  # Validates, normalizes, and formats Brazilian national phone numbers
  # (mobile and landline, no +55 country code).
  module Phone
    module_function

    ALLOWED_CHARS = /\A[\d\s()-]+\z/.freeze
    private_constant :ALLOWED_CHARS

    # Strips formatting and returns the canonical (digits-only)
    # representation of value.
    def normalize(value)
      Shared.remove_non_digits(value)
    end

    # Returns true if value is a structurally valid Brazilian phone number.
    #
    # Enforces Anatel's numbering plan: the DDD must be one of the 67 codes
    # actually assigned, mobile numbers (11 digits) must carry the "ninth
    # digit" 9 (Resolução nº 553/2010), and landline numbers (10 digits)
    # must start with 2-5.
    def is_valid?(value)
      return false unless value.match?(ALLOWED_CHARS)

      phone = normalize(value)

      return false unless [10, 11].include?(phone.length)
      return false unless Shared::VALID_DDDS.include?(phone[0...2])

      subscriber_first_digit = phone[2]

      return subscriber_first_digit == "9" if phone.length == 11

      "2345".include?(subscriber_first_digit)
    end

    # Returns value as (XX) XXXXX-XXXX (mobile) or (XX) XXXX-XXXX
    # (landline).
    #
    # If the normalized value has an invalid length, value is returned
    # unchanged.
    def format(value)
      phone = normalize(value)

      case phone.length
      when 11
        "(#{phone[0...2]}) #{phone[2...7]}-#{phone[7...11]}"
      when 10
        "(#{phone[0...2]}) #{phone[2...6]}-#{phone[6...10]}"
      else
        value
      end
    end
  end
end
