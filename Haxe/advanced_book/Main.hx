import Sys;
import Random;
using StringTools;

class Main {
  static var rooms:Map<String, Room> = new Map<String,Room>();
  static var actualRoom:Room;

  static function main() {
    defineRooms();
    if(rooms.exists("main_room")){
      actualRoom = rooms.get("main_room");
    }
    else{
      print("Looking for main_room");
      Sys.exit(0);
    }
    run();
  }

  static function run() : Void {
    var actions = [
      ~/exit/ => exit,
      ~/save/ => placeHolder,
      ~/use ([^\s]+) on ([^\s]+)/ => placeHolder,
      ~/combine ([^\s]+) with ([^\s]+)/ => placeHolder,
      ~/activate ([^\s]+)/ => placeHolder,
      ~/open ([^\s]+)/ => placeHolder,
      ~/close ([^\s]+)/ => placeHolder,
      ~/take ([^\s]+)/ => placeHolder,
      ~/drop ([^\s]+)/ => placeHolder,
      ~/look ([^\s]+)/ => look,
      ~/say ([^\s]+) to ([^\s]+)/ => placeHolder,
      ~/open ([^\s]+)/ => open,
    ];
    var entry = "";
    var stdin = Sys.stdin();
    while(entry != "exit"){
      Sys.println("What do you whant to do?");
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
    printError();
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

  static function printError() {
    print(Random.fromArray([
      "This doens't mean anything",
      "What ?",
      "Nothing happens...",
      "Hum..."
      ]));
  }

  static function defineRooms(){
    var room = new Room("Room", "A dark room");
    rooms.set("main_room", room);
  }

  static function placeHolder(reg:EReg){
    print("Not yep implemented");
  }

  static function look(reg:EReg){
    var name = reg.matched(1);
    if(name == "room"){
      print(actualRoom.desc);
    }
    else{
      printError();
    }
  }

  static function exit(reg:EReg){
    print("Goodbye!");
    Sys.exit(0);
  }

  static function open(reg:EReg){
    print(reg.matched(1));
  }
}
