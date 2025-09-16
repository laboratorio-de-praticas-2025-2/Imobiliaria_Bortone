import fs from "fs";
import path from "path";

function imagemParaBase64(filePath) {
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath);
  return `data:image/${ext};base64,${data.toString("base64")}`;
}

export default imagemParaBase64;
