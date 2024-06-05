import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import readline from "readline";
import { GearKeyring, GearApi, ProgramMetadata } from "@gear-js/api";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// const keyring = await GearKeyring.fromSuri("//Alice");

export const resolveOut = (file) => {
  return path.resolve(__dirname, "../target/wasm32-unknown-unknown/release", file);
};

export const resolve = (file) => {
  return path.resolve(__dirname, file);
};

export function maskInput(prompt) {
  return new Promise((resolve, reject) => {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.input.on("keypress", function (c, k) {
      // get the number of characters entered so far:
      var len = rl.line.length;
      // move cursor back to the beginning of the input:
      readline.moveCursor(rl.output, -len, 0);
      // clear everything to the right of the cursor:
      readline.clearLine(rl.output, 1);
      // replace the original input with asterisks:
      for (var i = 0; i < len; i++) {
        rl.output.write("*");
      }
    });

    rl.question(prompt, function (pw) {
      // pw == the user's input:
      resolve(pw);
      rl.close();
    });
  });
}

export const getKeyring = async () => {
  const jsonKeyring = fs.readFileSync(resolve("./wallet/export.json")).toString();
  const password = await maskInput("enter password:");
  return GearKeyring.fromJson(jsonKeyring, password);
};

export const timeoutPromise= time=>new Promise((resolve)=>setTimeout(()=>resolve(time),time));