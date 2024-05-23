import fs from "fs";
import path from "path";
import minify from "@node-minify/core";
import jsMinifier from "@node-minify/uglify-js";

const sourceFolder = path.join("./", "src", "public");
const destinationFolder = path.join("./", "dist", "public");

// Create destination public folder
fs.mkdirSync(destinationFolder, { recursive: true });

fs.readdirSync(sourceFolder).forEach((file) => {
  const sourceFile = path.join(sourceFolder, file);
  const destinationFile = path.join(destinationFolder, file);
  fs.copyFileSync(sourceFile, destinationFile);
});

const distPath = "./dist";

function minifyAll(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      minifyAll(filePath);
    } else if (stats.isFile()) {
      if (file.endsWith(".js")) {
        minify({
          compressor: jsMinifier,
          input: filePath,
          output: filePath,
        });
      }
    }
  });
}

minifyAll(distPath);
