const fs = require("fs");
const path = require("path");
const { CONFIG } = require("./utils/config");
const { mapImportsToFunctions } = require("./utils/parser");
const { resolveAffectedFunctions } = require("./utils/matcher");

// Execution
try {
  const changedFiles = parseArguments();
  const deployTargets = determineDeployTargets(changedFiles);
  console.log(deployTargets);
} catch (error) {
  console.error("❌ Error resolving deploy targets:", error.message);
  console.log("all");
  process.exit(1);
}

// Logic
function determineDeployTargets(changedFiles) {
  // 1. Safety Check
  if (changedFiles.some((file) => CONFIG.coreFiles.has(file))) {
    console.error("Core configuration file changed. Deploying ALL.");
    return "all";
  }

  // 2. Read index.js
  const indexFilePath = path.join(CONFIG.functionsDir, CONFIG.indexFileName);
  let importMap;
  try {
    const indexContent = fs.readFileSync(indexFilePath, "utf8");
    importMap = mapImportsToFunctions(indexContent);
  } catch (e) {
    console.error(
      `Could not read ${indexFilePath}. Defaulting to full deploy.`,
    );
    return "all";
  }

  // 3. Match changes
  const targets = resolveAffectedFunctions(changedFiles, importMap);

  // 4. Format Output
  if (targets.size > 0) {
    return Array.from(targets).join(",");
  }

  // 5. Edge Case: index.js changed but no sub-modules matched
  const indexFileRel = path.join(CONFIG.functionsDir, CONFIG.indexFileName);
  if (changedFiles.includes(indexFileRel)) {
    console.error(
      "index.js changed but no implementation files matched. Deploying ALL.",
    );
    return "all";
  }

  return "";
}

function parseArguments() {
  const args = process.argv[2] || "";
  return args.split(" ").filter((f) => f.trim().length > 0);
}
