defmodule Page do
  defstruct [text: "", next: []]

  def play(%Page{next: []}) do
    IO.puts("End of the game")
  end
  def play(page) do
    print_text(page.text)

    page.next
    |> Enum.with_index
    |> Enum.each(fn({{name, _}, i}) ->
      IO.puts("#{i} => #{name}")
    end)
  end

  def print_text(chaine) do
    if String.length(chaine) <= 80 do
      IO.puts(chaine)
    else
      {type, delim} = last_blank(chaine, 80)
      delimbis = case type  do
        :ok -> delim + 1
        :none -> delim
      end
      IO.puts(String.slice(chaine, 0, delimbis))
      print_text(String.slice(chaine, delimbis..-1))
    end
  end

  defp last_blank(_, O) do
    {:none, 80}
  end
  defp last_blank(chaine, index) do
    cond do
      String.at(chaine, index) == " " -> {:ok, index}
      true -> last_blank(chaine, index-1)
    end
  end
end
