# frozen_string_literal: true

require_relative "shared"

module BrValidator
  # Validates, normalizes, and formats Brazilian CEP (postal) codes.
  module Cep
    module_function

    ALLOWED_CHARS = /\A[\d-]+\z/.freeze
    private_constant :ALLOWED_CHARS

    # Strips formatting and returns the canonical (digits-only)
    # representation of value.
    def normalize(value)
      Shared.remove_non_digits(value)
    end

    # Returns true if value is a structurally valid CEP.
    #
    # A CEP has no check digit -- it is an 8-digit postal routing code
    # (region, sub-region, sector, subsector and distribution suffix)
    # defined by Correios -- so validity here means structural correctness
    # (8 digits), not whether the code exists in Correios' address
    # database.
    def is_valid?(value)
      return false unless value.match?(ALLOWED_CHARS)

      normalize(value).length == 8
    end

    # Returns value as XXXXX-XXX.
    #
    # If the normalized value has an invalid length, value is returned
    # unchanged.
    def format(value)
      cep = normalize(value)

      return value unless cep.length == 8

      "#{cep[0...5]}-#{cep[5...8]}"
    end
  end
end
