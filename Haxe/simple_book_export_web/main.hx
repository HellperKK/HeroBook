import sys.io.File;
import Sys;
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
    run(book, vocab);
  }

  static function run(book, vocab) {
    var actual = "main";
    var page = book.get(actual);
    while(page != null) {
      var next:Array<PageNext> = page.next;
      show_text(page.text);
      show_next(next);
      var num = getInput(next.length, vocab);
      actual = next[num].page;
      page = book.get(actual);
    }
    Sys.println(vocab.get("End"));
  }

  static function show_text(text:String) {

    if (text.length <= 80){
      Sys.println(text);
    }
    else {
      var i = 79;
      while ((text.charAt(i) != ' ') && i >= 0){
        i -= 1;
      }
      if (i < 0) {
        i = 79;
      }
      else {
        i += 1;
      }
      Sys.println(text.substring(0, i).trim());
      show_text(text.substring(i));
    }
  }

  static function show_next(next:Array<PageNext>) {
    for( i in 0...next.length ) {
      Sys.println('${i} ${next[i].action}');
    }
  }

  static function getInput(max, vocab:Map<String, String>) {
    var stdin = Sys.stdin();
    while(true) {
      Sys.println(vocab.get("Ask_input"));
      var entry = Std.parseInt(stdin.readLine());
      var inputError = vocab.get("Input_error").replace("{min}", "0").replace("{max}", Std.string(max - 1));
      if (entry == null){
        Sys.println(inputError);
        continue;
      }
      if ((entry < 0) || (entry >= max)) {
        Sys.println(inputError);
        continue;
      }
      return entry;
    }
  }
}
