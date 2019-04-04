import Main;
import sys.io.File;
import Lambda;
using StringTools;

class Generator {
  private var name:String;
  private var text:String;
  private var next:Array<PageNext>;

  public static function convertMain(name:String){
    if(name == "main"){
      return "index";
    }
    else{
      return name;
    }
  }

  public function new(page:Page){
    name = page.name;
    text = page.text;
    next = page.next;
  }

  public function generate(dico:Map<String, Page>, out:String) : Void {
    var template:String = File.getContent("data/template.html");
    var choices = "";
    for( suivant in next ) {
      if(dico.exists(suivant.page)) {
        choices += '<a href="${convertMain(suivant.page)}.html">${suivant.action}</a>' + '<br>';
      }
    }
    template = template.replace("{text}", text).replace("{next}", choices);
    File.saveContent('output/${convertMain(name)}.html', template);
  }
}
