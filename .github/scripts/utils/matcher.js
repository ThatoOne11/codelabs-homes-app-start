const path = require("path");
const { CONFIG } = require("./config");

function resolveAffectedFunctions(changedFiles, importMap) {
  const targets = new Set();

  for (const mapEntry of importMap) {
    const isAffected = changedFiles.some((file) => {
      const relativePath = path.relative(CONFIG.functionsDir, file);
      if (relativePath.startsWith("..")) return false;
      return relativePath.startsWith(mapEntry.dir);
    });

    if (isAffected) {
      mapEntry.functions.forEach((funcName) => {
        targets.add(`functions:${funcName}`);
      });
    }
  }
  return targets;
}

module.exports = { resolveAffectedFunctions };
