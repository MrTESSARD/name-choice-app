// convert.js
const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "all.txt");
const outputPath = path.join(__dirname, "all.json");

const content = fs.readFileSync(inputPath, "utf-8");
const lines = content.split(/\r?\n/).filter(Boolean); // supprime lignes vides

fs.writeFileSync(outputPath, JSON.stringify(lines, null, 2), "utf-8");

console.log("Conversion terminée. Fichier JSON généré avec succès.");
