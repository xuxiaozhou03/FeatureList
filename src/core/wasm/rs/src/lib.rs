// src/lib.rs
// Rust WebAssembly config_crypto 库主入口

use base64::{engine::general_purpose, Engine as _};
use wasm_bindgen::prelude::*;

const OBFUSCATION_KEY: &str = "FeatureListWasmKey2025";

#[wasm_bindgen]
pub fn obfuscate_config(json: &str) -> String {
    let mixed = format!("{}{}{}", OBFUSCATION_KEY, json, OBFUSCATION_KEY);
    let base64 = general_purpose::STANDARD.encode(mixed);
    base64.chars().rev().collect()
}

#[wasm_bindgen]
pub fn deobfuscate_config(obfuscated: &str) -> Result<String, JsValue> {
    let reversed: String = obfuscated.chars().rev().collect();
    let decoded = general_purpose::STANDARD
        .decode(reversed)
        .map_err(|_| JsValue::from_str("Base64 decode error"))?;
    let mixed = String::from_utf8(decoded).map_err(|_| JsValue::from_str("UTF-8 decode error"))?;
    if !mixed.starts_with(OBFUSCATION_KEY) || !mixed.ends_with(OBFUSCATION_KEY) {
        return Err(JsValue::from_str("Invalid obfuscation key"));
    }
    let json = &mixed[OBFUSCATION_KEY.len()..mixed.len() - OBFUSCATION_KEY.len()];
    if !(json.starts_with('{') && json.ends_with('}')) {
        return Err(JsValue::from_str("Not a valid JSON object"));
    }
    Ok(json.to_string())
}
