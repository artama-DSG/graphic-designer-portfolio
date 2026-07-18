const AdmZip = require("adm-zip");
const zip = new AdmZip();

// Add local folders/files
zip.addLocalFolder("src", "src");
zip.addLocalFolder("public", "public");
zip.addLocalFile("package.json");
zip.addLocalFile("tsconfig.json");
zip.addLocalFile("vite.config.ts");
zip.addLocalFile("index.html");
zip.addLocalFile(".env.example");

// Write to disk
zip.writeZip("public/sumber-kode.zip");
console.log("Zip file created successfully!");
