require "json"

def print_next(liste)
  liste.each_with_index do |item, index|
    puts "#{index} : #{item["action"]}"
  end
end

def get_next(length, vocab)
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

def print_text(text)
  if text.length <= 79
    puts text
  else
    pointeur = 79
      while (text[pointeur] != " ") && (pointeur >= 0)
        pointeur -= 1
      end

    if pointeur < 0
      pointeur = 79
    else
      pointeur += 1
    end
    puts text[0...pointeur].strip
    print_text(text[pointeur..-1])
  end
end

vocab_tmp = JSON.parse(File.open("data/vocab.json", "r"){|file| file.read})
vocab = Hash.new
vocab_tmp.each{|voc| vocab[voc["name"]] = voc["text"]}
pages_file = JSON.parse(File.open("data/pages.json", "r"){|file| file.read})

pages = Hash.new
pages_file.each do |i|
  pages[i["name"]] = i
end

actual_page = pages["main"]
while actual_page != nil
  print_text(actual_page["text"])
  nexte = actual_page["next"]
  print_next(nexte)
  choice = get_next(nexte.length, vocab)
  actual_page = pages[nexte[choice]["page"]]
end
puts vocab["End"]
