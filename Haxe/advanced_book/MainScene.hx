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
