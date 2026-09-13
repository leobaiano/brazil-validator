# frozen_string_literal: true

module BrValidator
  # Validates, normalizes, and formats e-mail addresses.
  module Email
    module_function

    # Sourced from the WHATWG HTML Living Standard's email state regex
    # (used by browsers to validate <input type="email">). All quantifiers
    # are bounded, so it cannot suffer catastrophic backtracking.
    EMAIL_REGEX = /
      \A[a-zA-Z0-9.!\#$%&'*+\/=?^_`{|}~-]+
      @[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
      (?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+\z
    /x.freeze

    MAX_EMAIL_LENGTH = 254
    MAX_LOCAL_PART_LENGTH = 64
    private_constant :EMAIL_REGEX, :MAX_EMAIL_LENGTH, :MAX_LOCAL_PART_LENGTH

    # Trims whitespace and lowercases value.
    def normalize(value)
      value.strip.downcase
    end

    # Returns true if value is a structurally valid e-mail address, per the
    # WHATWG regular expression plus RFC 5321 length limits.
    def is_valid?(value)
      email = normalize(value)

      return false if email.empty? || email.length > MAX_EMAIL_LENGTH

      local_part = email.split("@", 2).first

      return false if local_part.nil? || local_part.empty? || local_part.length > MAX_LOCAL_PART_LENGTH

      email.match?(EMAIL_REGEX)
    end

    # Returns the same canonical value as normalize.
    #
    # Unlike CPF/CNPJ/CEP/Phone, an e-mail address has no visual mask to
    # apply.
    def format(value)
      normalize(value)
    end
  end
end
