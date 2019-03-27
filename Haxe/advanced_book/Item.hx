class Item{
  private var type:String;
  private var actions:Map<String, Array<String>->Void>

  public function new(type) {
    this.type = type;
    actions = new Map<String, Void->Void>();
  }

  public function addAction(name, action){
    actions.set(name, action);
  }

  public function activate(name, elms){
    if(actions.exist(name)){
      actions[name](elms)
    }
  }
}
