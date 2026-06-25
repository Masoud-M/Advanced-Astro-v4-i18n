import fs from "fs";
import path from "path";

const root = process.cwd();

// 1. Remove i18n feature folder
const i18nDir = path.join(root, "src/features/i18n");

if (fs.existsSync(i18nDir)) {
    fs.rmSync(i18nDir, { recursive: true, force: true });
    console.log("✔ Removed src/features/i18n");
}

// 2. Helper to swap .no-i18n → active file
function replaceNoI18n(filePath) {
    const noI18nPath = path.join(root, filePath + ".no-i18n.ts");
    const targetPath = path.join(root, filePath + ".ts");

    if (fs.existsSync(noI18nPath)) {
        fs.rmSync(targetPath, { force: true }); // remove old version
        fs.renameSync(noI18nPath, targetPath);  // promote fallback
        console.log(`✔ Replaced ${filePath}.no-i18n.ts → ${filePath}.ts`);
    } else {
        console.log(`⚠ Missing: ${filePath}.no-i18n.ts`);
    }
}

// 3. Replace core utility files
replaceNoI18n("src/js/getSiteContext");
replaceNoI18n("src/js/getBlogPosts");

console.log("\n✔ i18n removal complete");