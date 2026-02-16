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

    // FIX: Do not use path.dirname(). Use the import path as the specific prefix.
    // e.g. "./features/cart" -> "features/cart"
    // This ensures "features/cart.js" matches this, but "features/user.js" does not.
    const cleanPath = importPathRaw.replace(/^\.\//, "");

    mappings.push({
      dir: cleanPath, // Use the full import path as the identifier
      functions: functionNames,
    });
  }
  return mappings;
}

module.exports = { mapImportsToFunctions };
