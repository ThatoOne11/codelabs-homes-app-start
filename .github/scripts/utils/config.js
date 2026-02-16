const CONFIG = {
  // Path to functions folder from the repo root
  functionsDir: "firebase/functions",
  indexFileName: "index.js",

  // Files that trigger a FULL deploy if changed
  // (Paths must be relative to repo root)
  coreFiles: new Set([
    "firebase/functions/package.json",
    "firebase/functions/package-lock.json",
    "firebase/firebase.json",
  ]),
};

module.exports = { CONFIG };
