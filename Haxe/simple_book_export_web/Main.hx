import sys.io.File;
import Sys;
import sys.FileSystem;
using StringTools;

typedef VocabWord = {
  var name:String;
  var text:String;
}

typedef PageNext = {
  var action:String;
  var page:String;
}

typedef Page = {
  var name:String;
  var text:String;
  var next:Array<PageNext>;
}

class Main {
  static function main() {
    // vocab
    var tmp:String = File.getContent("data/vocab.json");
    var vocabArr:Array<VocabWord> = haxe.Json.parse(tmp);
    var vocab:Map<String, String> = [for (i in vocabArr) i.name => i.text];

    // pages
    var tmp:String = File.getContent("data/pages.json");
    var pagesArr:Array<Page> = haxe.Json.parse(tmp);
    var book = [for (i in pagesArr) i.name => i];
    var generators = [for (i in pagesArr) new Generator(i)];
    cleanOutput("output");
    FileSystem.createDirectory("output");
    File.copy("data/style.css", "output/style.css");
    for(generator in generators) {
      generator.generate(book, "output");
    }
    //run(book, vocab);
  }

  static function cleanOutput(name:String) : Void {
    if(FileSystem.exists(name)) {
      if(FileSystem.isDirectory(name)) {
        var files = FileSystem.readDirectory(name);
        for(file in files) {
          cleanOutput('${name}/${file}');
        }
        FileSystem.deleteDirectory(name);
      }
      else {
        FileSystem.deleteFile(name);
      }
    }
  }
}
