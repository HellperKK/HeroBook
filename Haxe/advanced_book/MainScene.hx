import Scene;
import Printer;
import Sys;
import Game;

class MainScene extends Scene{

  override public function new() {
    super();
    actions = [
      ~/hello/ => hello,
      ~/exit/ => exit,
      ~/open ([^\s]+)/ => open,
    ];
  }

  override public function run():Void {
    var entry = "";
    var stdin = Sys.stdin();
    while(entry != "exit"){
      Sys.println("What do you whant to do ?");
      entry = stdin.readLine().toLowerCase();
      find(entry);
    }
  }

  public function hello(reg:EReg) : Void {
    Printer.print("Hello!");
  }

  public function exit(reg:EReg) : Void {
    Printer.print("Goodbye!");
    Game.changeScene(null);
  }

  public function open(reg:EReg) : Void {
    Printer.print(reg.matched(1));
  }
}
