const path = require("path");

function mapImportsToFunctions(fileContent) {
  const mappings = [];
  const regex =
    /const\s+\{([\s\S]+?)\}\s*=\s*require\(\s*["']([^"']+)["']\s*\)/g;

  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    const exportsRaw = match[1];
    const importPathRaw = match[2];

    const functionNames = exportsRaw
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const cleanPath = importPathRaw.replace(/^\.\//, "");
    const directory = path.dirname(cleanPath);

    mappings.push({
      dir: directory,
      functions: functionNames,
    });
  }
  return mappings;
}

module.exports = { mapImportsToFunctions };
