import fs from "fs";
import path from "path";

const root = process.cwd();

function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✔ Removed ${path.relative(root, dir)}`);
    }
}

function removeFromFile(filePath, patterns) {
    const fullPath = path.join(root, filePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠ Missing: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, "utf8");

    for (const pattern of patterns) {
        content = content.replace(pattern, "");
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✔ Updated ${filePath}`);
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
replaceNoI18n("src/js/routes");

// removes imports and component usage from files after i18n removal
removeFromFile("src/components/Settings/Settings.astro", [
    /import\s+TwoLocalesSelect\s+from\s+["']src\/features\/i18n\/LanguageSwitch\/TwoLocalesSelect\.astro["'];?\r?\n/g,
    /\s*<TwoLocalesSelect\s*\/>\r?\n?/g,
]);

removeFromFile("src/pages/index.astro", [
    /import\s+BrowserLanguageRedirect\s+from\s+["']src\/features\/i18n\/LanguageSwitch\/BrowserLanguageRedirect\.astro["'];?\r?\n/g,
    /\s*<BrowserLanguageRedirect\s*\/>\r?\n?/g,
]);

console.log("\n✔ i18n removal complete");