require "json"

def print_next(liste)
  liste.each_with_index do |item, index|
    puts "#{index} : #{item["action"]}"
  end
end

def get_nexte(length, vocab)
  while true
    puts vocab["Ask_input"]
    entree = gets.strip
    if (0...length).include?(entree.to_i) && entree.to_i.to_s == entree
      break
    end
    puts vocab["Input_error"].sub("{}", 0.to_s).sub("{}", (length - 1).to_s)
  end
  entree.to_i
end

vocab = JSON.parse(File.open("data/vocab.json", "r"){|file| file.read})
pages_file = JSON.parse(File.open("data/pages.json", "r"){|file| file.read})

pages = Hash.new
pages_file.each do |i|
  pages[i["name"]] = i
end

actual_page = pages["main"]
while actual_page != nil
  puts actual_page["text"]
  nexte = actual_page["next"]
  print_next(nexte)
  choice = get_nexte(nexte.length, vocab)
  actual_page = pages[nexte[choice]["page"]]
end
puts vocab["End"]
