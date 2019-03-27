class Item{
  public var type:String;
  private var actions:Map<String, Void->Void>

  public function new(type) {
    this.type = type;
    actions = new Map<String, Void->Void>();
  }
}
