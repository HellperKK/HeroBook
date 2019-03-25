import Sys;
import Printer;
import Game;
using StringTools;

class Main {
  static function main() {
    run();
  }

  static function run() {
    var entry = "";
    var stdin = Sys.stdin();
    while(entry != "exit"){
      Sys.println("What do you whant to do ?");
      entry = stdin.readLine().toLowerCase();
      Game.find(entry);
      // var r = ~/open ([^\s]+)/;
      // if(r.match(entry)){
      //   Printer.print('you have oppened the ${r.matched(1)}');
      // }
    }
    Printer.print("Goodbye !");
  }
}
