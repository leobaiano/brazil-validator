# frozen_string_literal: true

require_relative "lib/br_validator/version"

Gem::Specification.new do |spec|
  spec.name = "br-validator"
  spec.version = BrValidator::VERSION
  spec.authors = ["Matheus"]

  spec.summary = "Validation, normalization, and formatting for Brazilian data."
  spec.description = "CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição " \
                      "Estadual validators for Ruby."
  spec.homepage = "https://github.com/matheuslm7/br-validator"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "#{spec.homepage}/tree/master/ruby"

  spec.files = Dir["lib/**/*.rb"] + ["README.md"]
  spec.require_paths = ["lib"]
end
