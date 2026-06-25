import fs from "fs";
import path from "path";

const root = process.cwd();

function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✔ Removed ${path.relative(root, dir)}`);
    }
}

function replaceNoI18n(filePath) {
    const noI18nPath = path.join(root, `${filePath}.no-i18n.ts`);
    const targetPath = path.join(root, `${filePath}.ts`);

    if (!fs.existsSync(noI18nPath)) {
        throw new Error(`Missing fallback file: ${noI18nPath}`);
    }

    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { force: true });
    }

    fs.renameSync(noI18nPath, targetPath);

    console.log(
        `✔ Replaced ${path.basename(noI18nPath)} → ${path.basename(targetPath)}`
    );
}

// Remove i18n-owned directories
removeDirectory(path.join(root, "src/features/i18n"));
removeDirectory(path.join(root, "src/pages/fr"));

// Replace fallback utility files
replaceNoI18n("src/js/getSiteContext");
replaceNoI18n("src/js/getBlogPosts");

console.log("\n✔ i18n removal complete");