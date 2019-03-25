import Printer;
import Sys;

class Game{

  static public var actions:Map<EReg, EReg->Void>;

  public function new() {
    actions = [
      ~/hello/ => hello,
      ~/exit/ => exit,
      ~/open ([^\s]+)/ => open,
    ];
  }

  public function find(entry) : Void {
    for(val in actions.keys()){
      if (val.match(entry)){
        actions[val](val);
        return;
      }
    }
    Printer.print("No match found");
  }

  public function hello(reg:EReg) : Void {
    Printer.print("Hello!");
  }

  public function exit(reg:EReg) : Void {
    Printer.print("Goodbye!");
    Sys.exit(0);
  }

  public function open(reg:EReg) : Void {
    Printer.print(reg.matched(1));
  }
}
