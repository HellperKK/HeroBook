// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use rfd::FileDialog;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;
use std::sync::Mutex;
use tauri::State;

struct Storage {
    store: Mutex<HashMap<String, String>>,
}

fn get_file_name() -> Result<String, ()> {
    let file = FileDialog::new()
        .add_filter("zip", &["zip"])
        .set_file_name("game.zip")
        .set_directory("/")
        .save_file();

    if let Some(file_name) = file {
        Ok(file_name.to_str().expect("should work").to_string())
    } else {
        Err(())
    }
}

#[tauri::command]
fn new(storage: State<Storage>) -> () {
    let mut store = storage.store.lock().unwrap();
    store.clear();
}

#[tauri::command]
fn download() -> String {
    let bytes = reqwest::blocking::get("https://sh.rustup.rs")
        .and_then(|response| response.bytes())
        .expect("request failed");
    general_purpose::STANDARD.encode(bytes)
}

#[tauri::command]
fn save(content: &str, file_type: &str, open_modal: bool, storage: State<Storage>) -> String {
    let mut store = storage.store.lock().unwrap();
    let file_name = if open_modal {
        get_file_name()
    } else if store.contains_key(&String::from(file_type)) {
        Ok(store
            .get(file_type)
            .expect("file_name should exist")
            .to_owned())
    } else {
        get_file_name()
    };

    match file_name {
        Err(_) => String::from("Could not open file"),
        Ok(file_name) => {
            let file_result = File::create(&file_name);
            if let Ok(mut file) = file_result {
                let bytes = general_purpose::STANDARD.decode(content).unwrap();
                let result = file.write_all(&bytes);

                if let Err(message) = result {
                    return message.to_string();
                } else {
                    store.insert(String::from(file_type), file_name);
                    String::from("Done")
                }
            } else {
                String::from("Could not open file")
            }
        }
    }
}

fn main() {
    /*let file = FileDialog::new()
        .add_filter("text", &["txt", "rs"])
        .add_filter("rust", &["rs", "toml"])
        .set_directory("/")
        .save_file()
        .expect("there sould be a file");
    println!("The user chose: {:?}", file.to_str().expect("oupsi"));*/
    tauri::Builder::default()
        .manage(Storage {
            store: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![save, download, new])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
