// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use rfd::FileDialog;
use std::fs::File;
use std::io::prelude::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn download() -> String {
    let bytes = reqwest::blocking::get("https://sh.rustup.rs")
        .and_then(|response| response.bytes())
        .expect("request failed");
    general_purpose::STANDARD.encode(bytes)
}

#[tauri::command]
fn save(content: &str) -> String {
    let file = FileDialog::new()
        .add_filter("zip", &["zip"])
        .set_directory("/")
        .save_file();

    if let Some(file_name) = file {
        let file_result = File::create(file_name);

        if let Ok(mut file) = file_result {
            let bytes = general_purpose::STANDARD.decode(content).unwrap();
            let result = file.write_all(&bytes);

            if let Err(message) = result {
                return message.to_string();
            }

            return "done".to_string();
        }

        return "Could not open file".to_string();
    } else {
        return "Could not select a path".to_string();
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
        .invoke_handler(tauri::generate_handler![greet, save, download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
