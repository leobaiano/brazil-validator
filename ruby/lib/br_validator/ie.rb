# frozen_string_literal: true

require_relative "ie/ac"
require_relative "ie/al"
require_relative "ie/am"
require_relative "ie/ap"
require_relative "ie/ba"
require_relative "ie/ce"
require_relative "ie/df"
require_relative "ie/es"
require_relative "ie/go"
require_relative "ie/ma"
require_relative "ie/mg"
require_relative "ie/ms"
require_relative "ie/mt"
require_relative "ie/pa"
require_relative "ie/pb"
require_relative "ie/pe"
require_relative "ie/pi"
require_relative "ie/pr"
require_relative "ie/rj"
require_relative "ie/rn"
require_relative "ie/ro"
require_relative "ie/rr"
require_relative "ie/rs"
require_relative "ie/sc"
require_relative "ie/se"
require_relative "ie/sp"
require_relative "ie/to"

module BrValidator
  # Validates, normalizes, and formats Brazilian Inscrição Estadual
  # numbers.
  #
  # Inscrição Estadual has no single national rule: each state (SEFAZ)
  # defines its own digit count and check-digit algorithm, so every UF is
  # modeled as its own module under BrValidator::Ie and registered in the
  # STATES map below. A UF absent from that map is simply not supported
  # yet.
  module Ie
    module_function

    STATES = {
      "AC" => Ac,
      "AL" => Al,
      "AM" => Am,
      "AP" => Ap,
      "BA" => Ba,
      "CE" => Ce,
      "DF" => Df,
      "ES" => Es,
      "GO" => Go,
      "MA" => Ma,
      "MG" => Mg,
      "MS" => Ms,
      "MT" => Mt,
      "PA" => Pa,
      "PB" => Pb,
      "PE" => Pe,
      "PI" => Pi,
      "PR" => Pr,
      "RJ" => Rj,
      "RN" => Rn,
      "RO" => Ro,
      "RR" => Rr,
      "RS" => Rs,
      "SC" => Sc,
      "SE" => Se,
      "SP" => Sp,
      "TO" => To
    }.freeze
    private_constant :STATES

    def resolve_state(uf)
      STATES[uf.strip.upcase]
    end
    private_class_method :resolve_state

    # Returns true if value is a valid Inscrição Estadual for uf.
    def is_valid?(value, uf)
      state = resolve_state(uf)

      return false if state.nil?

      state.is_valid?(value)
    end

    # Strips formatting and returns the canonical representation of value
    # for uf.
    #
    # If uf is not supported, value is returned unchanged.
    def normalize(value, uf)
      state = resolve_state(uf)

      return value if state.nil?

      state.normalize(value)
    end

    # Returns value in uf's standard human-readable representation.
    #
    # If uf is not supported or the normalized value has an invalid
    # length, value is returned unchanged.
    def format(value, uf)
      state = resolve_state(uf)

      return value if state.nil?

      state.format(value)
    end
  end
end
