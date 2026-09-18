defmodule BrazilValidatorTest do
  use ExUnit.Case

  test "módulo principal está carregado" do
    assert Code.ensure_loaded?(BrazilValidator)
  end
end
