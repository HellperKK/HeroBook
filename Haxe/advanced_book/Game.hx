import Scene;

class Game{
  static private var scene:Scene = null;
  static public function start(sc:Scene){
    scene = sc;
    while(scene != null){
      sc.run();
    }
  }

  static public function changeScene(sc:Scene){
    scene = sc;
  }
}
