// 加密和解密 editConfig，依赖 wasm 包
import init, {
  obfuscate_config,
  deobfuscate_config,
} from "../wasm/pkg/config_crypto";

let wasmInitialized = false;
export async function encryptEditConfig(config: object): Promise<string> {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
  return obfuscate_config(JSON.stringify(config));
}

export async function decryptEditConfig(str: string): Promise<object> {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
  const json = deobfuscate_config(str);
  return JSON.parse(json);
}
