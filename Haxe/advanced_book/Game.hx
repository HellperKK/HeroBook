import Printer;
import Sys;

class Game{
  static public var actions:Map<EReg, EReg->Void> = [
    ~/hello/ => hello,
    ~/exit/ => exit,
    ~/open ([^\s]+)/ => open,
  ];

  static public function find(entry) : Void {
    for(val in actions.keys()){
      if (val.match(entry)){
        actions[val](val);
        return;
      }
    }
    Printer.print("No match found");
  }

  static function hello(reg:EReg) : Void {
    Printer.print("Hello !");
  }

  static function exit(reg:EReg) : Void {
    Printer.print("Goodbye !");
    Sys.exit(0);
  }

  static function open(reg:EReg) : Void {
    Printer.print(reg.matched(1));
  }
}
