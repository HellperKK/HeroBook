import Main;
import sys.io.File;
import Lambda;
import hxdtl.Template;
using StringTools;

class Generator {
  private var name:String;
  private var text:String;
  private var next:Array<PageNext>;

  public static function convertMain(name:String){
    if(name == "main"){
      return "index";
    }
    else if (name == "index"){
      return "main";
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
    var choices:Array<PageNext> = [];
    for( ne in next ) {
      if(dico.exists(ne.page)) {
        choices.push(ne);
      }
    }
    var template = new Template(File.getContent("data/template.html"));
    File.saveContent('${out}/${name}.html', template.render({
      text : text,
      next : next
    }));
  }
}
