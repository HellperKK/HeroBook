// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//use tauri::menu::Menu;
/*
std::process::exit(0);
*/

#[tauri::command]
fn is_desktop() -> bool {
    return true;
}

#[tauri::command]
fn quit() -> String {
    println!("quiting");
    std::process::exit(0);
}

fn main() {
    //let menu = Menu::new();
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        //.menu(menu)
        .invoke_handler(tauri::generate_handler![quit, is_desktop])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
