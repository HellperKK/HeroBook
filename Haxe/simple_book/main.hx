import sys.io.File;
import Sys;

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
    var vocab = [for (i in vocabArr) i.name => i.text];

    // pages
    var tmp:String = File.getContent("data/pages.json");
    var pagesArr:Array<Page> = haxe.Json.parse(tmp);
    var book = [for (i in pagesArr) i.name => i];
    trace(book);
  }

  static function run(book, vocab) {

  }
}
