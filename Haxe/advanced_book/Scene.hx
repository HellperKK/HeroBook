class Scene{
  public var actions:Map<EReg, EReg->Void>;

  public function new() {
    actions = null;
  }

  public function run():Void {
    var entry = "";
    var stdin = Sys.stdin();
    while(entry != "exit"){
      Sys.println("What do you whant to do ?");
      entry = stdin.readLine().toLowerCase();
      find(entry);
    }
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
}
