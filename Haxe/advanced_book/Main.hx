import Sys;
using StringTools;

class Main {
static var rooms:Map<String, Room> = new Map<String,Room>();

  static function main() {
    run();
    print("Goodbye !");
  }

  static function run() : Void {
    var actions = [
      ~/hello/ => hello,
      ~/exit/ => exit,
      ~/open ([^\s]+)/ => open,
    ];
    var entry = "";
    var stdin = Sys.stdin();
    while(entry != "exit"){
      Sys.println("What do you whant to do ?");
      entry = stdin.readLine().toLowerCase();
      activate(actions, entry);
    }
  }

  static function activate(actions:Map<EReg, EReg->Void>, entry:String) : Void {
    for(val in actions.keys()){
      if (val.match(entry)){
        actions[val](val);
        return;
      }
    }
    print("No match found");
  }

  static function print(text:String) {
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
      print(text.substring(i));
    }
  }

  static function hello(reg:EReg) : Void {
    print("Hello!");
  }

  static function exit(reg:EReg) : Void {
    print("Goodbye!");
    Sys.exit(0);
  }

  static function open(reg:EReg) : Void {
    print(reg.matched(1));
  }
}
