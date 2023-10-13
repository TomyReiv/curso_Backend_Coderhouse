import { promises as fs } from "fs";

export class utilsManager {
  async existFile(path) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }
  async pushFile(path, obj) {
    try {
      const newContent = JSON.stringify(obj, null, 2);
      await fs.writeFile(path, newContent, "utf-8");
    } catch (error) {
      console.log("Error writing file:", error);
    }
  }
}


