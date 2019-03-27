import Sys;
import Printer;
import Game;
import MainScene;
using StringTools;

class Main {
  static function main() {
    Game.start(new MainScene());
    Printer.print("Goodbye !");
  }

  static function run() {


  }
}
