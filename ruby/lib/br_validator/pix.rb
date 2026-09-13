# frozen_string_literal: true

require_relative "shared"
require_relative "cpf"
require_relative "cnpj"
require_relative "email"
require_relative "phone"

module BrValidator
  # Validates, normalizes, and formats PIX keys (CPF, CNPJ, e-mail, phone,
  # or random key).
  module Pix
    module_function

    # Identifies which kind of PIX key a value looks like.
    KEY_TYPES = %i[cpf cnpj email phone evp].freeze

    # Formats verified against Bacen's official DICT schema
    # (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de
    # Padrões para Iniciação do Pix:
    # - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT
    #   schema does not yet accept alphanumeric CNPJ as a key.
    # - The EVP (random key) is a canonical, case-insensitive UUID
    #   (8-4-4-4-12).
    # - Phone keys use the international format "+55AANNNNNNNNN", where AA
    #   is the DDD and NNNNNNNNN is a 9-digit mobile number -- Brazilian
    #   Pix only registers Brazilian mobile numbers, so the country code is
    #   fixed at 55.
    # - Email keys are case-insensitive and capped at 77 characters.
    EVP_REGEX = /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i.freeze
    CPF_SHAPE = /\A\d{11}\z/.freeze
    CNPJ_SHAPE = /\A\d{14}\z/.freeze
    PHONE_CHARS = /\A[\d\s()+-]+\z/.freeze
    PHONE_KEY_FORM = /\A\+55\d{11}\z/.freeze
    MAX_EMAIL_KEY_LENGTH = 77
    private_constant :EVP_REGEX, :CPF_SHAPE, :CNPJ_SHAPE, :PHONE_CHARS, :PHONE_KEY_FORM,
                      :MAX_EMAIL_KEY_LENGTH

    # Detects which kind of PIX key value looks like, or nil if it matches
    # none.
    def key_type(value)
      trimmed = value.strip

      return :evp if trimmed.match?(EVP_REGEX)
      return :email if trimmed.include?("@")
      return :phone if trimmed.start_with?("+")
      return :cpf if trimmed.match?(CPF_SHAPE)
      return :cnpj if trimmed.match?(CNPJ_SHAPE)

      nil
    end

    def normalize_phone_key(value)
      "+#{Shared.remove_non_digits(value)}"
    end
    private_class_method :normalize_phone_key

    def valid_phone_key?(value)
      return false unless value.match?(PHONE_CHARS)

      phone = normalize_phone_key(value)

      return false unless phone.match?(PHONE_KEY_FORM)

      ddd = phone[3...5]
      subscriber_first_digit = phone[5]

      Shared::VALID_DDDS.include?(ddd) && subscriber_first_digit == "9"
    end
    private_class_method :valid_phone_key?

    def format_phone_key(value)
      phone = normalize_phone_key(value)

      return value unless phone.match?(PHONE_KEY_FORM)

      "+55 #{Phone.format(phone[3..])}"
    end
    private_class_method :format_phone_key

    # Returns true if value is a valid PIX key of any recognized type.
    def is_valid?(value)
      type = key_type(value)

      return false if type.nil?

      trimmed = value.strip

      case type
      when :cpf then Cpf.is_valid?(trimmed)
      when :cnpj then Cnpj.is_valid?(trimmed)
      when :email then trimmed.length <= MAX_EMAIL_KEY_LENGTH && Email.is_valid?(trimmed)
      when :phone then valid_phone_key?(trimmed)
      when :evp then true
      end
    end

    # Dispatches to the canonical normalize rule of value's detected key
    # type. If the type cannot be detected, value is returned unchanged.
    def normalize(value)
      type = key_type(value)

      return value if type.nil?

      trimmed = value.strip

      case type
      when :cpf then Cpf.normalize(trimmed)
      when :cnpj then Cnpj.normalize(trimmed)
      when :email then Email.normalize(trimmed)
      when :phone then normalize_phone_key(trimmed)
      when :evp then trimmed.downcase
      end
    end

    # Dispatches to the canonical format rule of value's detected key
    # type. If the type cannot be detected, value is returned unchanged.
    def format(value)
      type = key_type(value)

      return value if type.nil?

      trimmed = value.strip

      case type
      when :cpf then Cpf.format(trimmed)
      when :cnpj then Cnpj.format(trimmed)
      when :email then Email.format(trimmed)
      when :phone then format_phone_key(trimmed)
      when :evp then trimmed.downcase
      end
    end
  end
end
