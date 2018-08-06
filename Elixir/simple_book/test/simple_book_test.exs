defmodule SimpleBookTest do
  use ExUnit.Case
  doctest SimpleBook

  test "greets the world" do
    assert SimpleBook.hello() == :world
  end
end
