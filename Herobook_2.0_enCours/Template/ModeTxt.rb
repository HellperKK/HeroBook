# encoding: UTF-8
def loadeur(nom)
	File.open("Pages/#{nom}.txt", "r").read.split("/")
end
def afficher(texte)
	texte = texte.split("_")
	texte.each do |i|
		autoRN(i)
		puts $vocab[0]
		passage = gets.chomp
	end
end
def autoRN(chaine) 
	if chaine.length < 80
		puts chaine
	else
		caractere = 79
		while not chaine[caractere] == " " 
			caractere -= 1
		end
		puts (chaine[0..caractere])
		autoRN(chaine[(caractere+1)..-1])
	end
end
def inputMinMax(min, max)	
	inpute = min - 1
	while not inpute.between?(min, max)
		inpute = gets.chomp.to_i
		if not inpute.between?(min, max)
			puts sprintf($vocab[3], min, max)
		end
	end
	inpute
end
def exist?(file)
	File.file?("Pages/#{file}.txt")
end
def existTell?(file)
	if File.file?("Pages/#{file}.txt")
		""
	else
		$vocab[5]
	end
end
def gameTxt
	#~ $vocab = File.open("Vocab/vocab.txt", "r").read.dup.force_encoding("utf-8")
	#~ puts $vocab
	$vocab = File.open("Vocab/vocab.txt", "r").read.split("/")
	toload = "MainPage"  
	while true
		page = loadeur(toload)
		texte = page[0]
		suite = page[1]
		afficher(texte)
		suite = suite.split("_")
		puts "0. #{$vocab[1]}"
		#~ suite.each do |i|
			#~ i = i.split("|")
		#~ end
		0.upto(suite.length - 1) do |index|
			suite[index] = suite[index].split("|")
			puts "#{index+1}. #{suite[index][0]}" + existTell?(suite[index][1])
		end
		while true
			puts $vocab[2]
			choix = inputMinMax(0, suite.length)
			if exist?(suite[choix-1][1]) || choix == 0
				break
			else	
				puts $vocab[4]
			end
		end
		if choix == 0
			break
		else
			toload = suite[choix-1][1]
		end
	end
end
#gameTxt