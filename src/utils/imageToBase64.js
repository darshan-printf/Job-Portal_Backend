import fs from "fs";
import path from "path";

const imageToBase64 = (filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    const file = fs.readFileSync(fullPath);
    const mimeType = path.extname(fullPath).slice(1);
    return `data:image/${mimeType};base64,${file.toString("base64")}`;
  } catch (err) {
    return "";
  }
};

export default imageToBase64;