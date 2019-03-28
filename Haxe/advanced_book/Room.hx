class Room extends Item{

  private var content:Array<Item>;

  public function new(type, desc) {
    super(type, desc);
    content = [];
  }

  public function add(item) {
    content.push(item);
  }
}
