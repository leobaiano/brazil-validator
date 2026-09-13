# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("../lib", __dir__)

require "minitest/autorun"
require "br_validator/cpf"
require "br_validator/cnpj"
require "br_validator/cep"
require "br_validator/phone"
require "br_validator/email"
require "br_validator/pix"
require "br_validator/ie"
