class Scene{
  public var actions:Map<EReg, EReg->Void>;

  public function new() {
    actions = null;
  }

  public function run():Void {
    
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
