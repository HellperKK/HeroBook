class Item{
  private var type:String;
  public var desc:String;
  private var actions:Map<String, Array<String>->Void>;

  public function new(type, desc){
    this.type = type;
    this.desc = desc;
    actions = new Map<String, Array<String>->Void>();
  }

  public function addAction(name, action){
    actions.set(name, action);
  }

  public function activate(name, elms){
    if(actions.exists(name)){
      actions[name](elms);
    }
  }
}
