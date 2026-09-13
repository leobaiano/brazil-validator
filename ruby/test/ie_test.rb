# frozen_string_literal: true

require_relative "test_helper"

class IeTest < Minitest::Test
  # Every value below is either the exact worked example published by the
  # state's own SEFAZ "Roteiro de Crítica da Inscrição Estadual" (mirrored
  # at sintegra.gov.br/Cad_Estados/cad_XX.html), or, where the source
  # describes the algorithm without a numeric example (RJ's weights, MG's
  # second vector, MS), a value independently hand-computed against that
  # same official algorithm. DF is the one exception: sintegra.gov.br's
  # own DF page is empty, so its vector instead comes from two independent
  # secondary sources that agree with each other and whose arithmetic was
  # re-checked by hand (see ie/df.rb). This mirrors the vectors used by
  # the TypeScript, Go, Python, and Java test suites, so all five ports
  # are checked against the same regression data.
  OFFICIAL_VECTORS = [
    %w[SP 110042490114],
    %w[RJ 99999993],
    %w[RJ 12345674],
    %w[MG 0623079040081],
    %w[MG 3131234560089],
    %w[AC 0100482300112],
    %w[AL 240000048],
    %w[AM 999999990],
    %w[AP 030123459],
    %w[BA 12345663],
    %w[BA 61234557],
    %w[BA 100000306],
    %w[CE 060000015],
    %w[ES 999999990],
    %w[GO 109876547],
    %w[MA 120000385],
    %w[MS 281234566],
    %w[MT 00130000019],
    %w[PA 159999995],
    %w[PA 750000023],
    %w[PB 060000015],
    %w[PE 032141840],
    %w[PI 012345679],
    %w[PR 1234567850],
    %w[RN 200400401],
    %w[RN 2000400400],
    %w[RO 00000000625213],
    %w[RR 240061536],
    %w[RR 240066281],
    %w[RR 240017556],
    %w[RR 240034290],
    %w[RR 240013603],
    %w[RR 240082668],
    %w[RR 240073562],
    %w[RR 240054674],
    %w[RR 240041455],
    %w[RR 240013407],
    %w[RS 2243658792],
    %w[SC 251040852],
    %w[SE 271234563],
    %w[TO 29010227836],
    %w[DF 0730000100109]
  ].freeze

  def flip_last_digit(value)
    last = value[-1].to_i
    "#{value[0...-1]}#{(last + 1) % 10}"
  end

  def test_official_vectors_are_valid
    OFFICIAL_VECTORS.each do |uf, value|
      assert BrValidator::Ie.is_valid?(value, uf), "#{uf} #{value}"
    end
  end

  def test_tampered_official_vectors_are_invalid
    OFFICIAL_VECTORS.each do |uf, value|
      tampered = flip_last_digit(value)
      refute BrValidator::Ie.is_valid?(tampered, uf), "#{uf} #{tampered}"
    end
  end

  def test_formatted_official_examples
    [
      %w[SP 110.042.490.114],
      %w[RJ 99.999.99-3],
      %w[MG 062.307.904/0081],
      %w[AC 01.004.823/001-12],
      %w[AM 99.999.999-0],
      %w[BA 123456-63],
      %w[BA 612345-57],
      %w[BA 1000003-06],
      %w[CE 06000001-5],
      %w[GO 10.987.654-7],
      %w[MT 0013000001-9],
      %w[PA 15999999-5],
      %w[PA 75000002-3],
      %w[PE 0321418-40],
      %w[PR 123.45678-50],
      %w[RN 20.040.040-1],
      ["RN", "20.0.040.040-0"],
      %w[RO 0000000062521-3],
      %w[RR 24006153-6],
      %w[RS 224/3658792],
      %w[SC 251.040.852],
      %w[SE 27123456-3],
      %w[DF 07.300.001.001-09],
      ["SP", "P-01100424.3/002"]
    ].each do |uf, value|
      assert BrValidator::Ie.is_valid?(value, uf), "#{uf} #{value}"
    end
  end

  def test_prefix_and_type_constraints
    [
      %w[AC 0200482300112],
      %w[AL 241000048],
      %w[AP 040123459],
      %w[GO 159876547],
      %w[MS 291234566],
      %w[PA 169999995],
      %w[RN 210400401],
      %w[RR 230061536],
      %w[TO 29040227836],
      %w[DF 0830000100109]
    ].each do |uf, value|
      refute BrValidator::Ie.is_valid?(value, uf), "#{uf} #{value}"
    end
  end

  def test_produtor_rural
    assert BrValidator::Ie.is_valid?("P-01100424.3/002", "SP")
    assert BrValidator::Ie.is_valid?("p-01100424.3/002", "SP")
    refute BrValidator::Ie.is_valid?("P-01100424.4/002", "SP")
    refute BrValidator::Ie.is_valid?("P-11100424.3/002", "SP")
    assert_equal "P011004243002", BrValidator::Ie.normalize("p-01100424.3/002", "SP")
    assert_equal "P-01100424.3/002", BrValidator::Ie.format("P011004243002", "SP")
  end

  def test_unsupported_uf
    refute BrValidator::Ie.is_valid?("110042490114", "XX")
    assert_equal "110042490114", BrValidator::Ie.normalize("110042490114", "XX")
    assert_equal "110042490114", BrValidator::Ie.format("110042490114", "XX")
  end

  def test_normalize_and_format_round_trip
    [
      %w[SP 110.042.490.114 110042490114],
      %w[RJ 99.999.99-3 99999993],
      %w[MG 062.307.904/0081 0623079040081],
      %w[BA 123456-63 12345663],
      %w[RS 224/3658792 2243658792],
      %w[DF 07.300.001.001-09 0730000100109]
    ].each do |uf, formatted, normalized|
      assert_equal normalized, BrValidator::Ie.normalize(formatted, uf), uf
      assert_equal formatted, BrValidator::Ie.format(normalized, uf), uf
    end

    assert_equal "123", BrValidator::Ie.format("123", "SP")
  end
end
