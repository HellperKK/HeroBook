import Sys;
using StringTools;

class Printer{
  static public function print(text:String) {
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
}
