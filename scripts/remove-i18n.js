#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

const root = process.cwd();
const backupRootDir = path.join(root, "scripts/deleted");

// ─── Guard: already run? ──────────────────────────────────────────────────────
const markerPath = path.join(root, ".i18n-removed");
if (fs.existsSync(markerPath)) {
    console.log("i18n has already been removed (.i18n-removed marker exists).");
    process.exit(0);
}

// ─── Confirmation prompt ──────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question(
    "\n⚠️  This will permanently disable and remove i18n support from the project.\n" +
    "Files will be backed up to 'scripts/deleted/'.\n\n" +
    "Proceed? (y/n): ",
    (answer) => {
        rl.close();
        if (answer.trim().toLowerCase() !== "y") {
            console.log("Aborted. No files were changed.");
            process.exit(0);
        }
        runRemoval();
    }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Moves a file or directory to scripts/deleted/ preserving its relative hierarchy */
function moveToDeletedBackup(targetPath) {
    if (!fs.existsSync(targetPath)) return;

    const relativePath = path.relative(root, targetPath);
    const destinationPath = path.join(backupRootDir, relativePath);

    // Create target directory structure inside scripts/deleted
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    // Move file/folder
    fs.renameSync(targetPath, destinationPath);
}

function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        const displayPath = path.relative(root, dir);
        moveToDeletedBackup(dir);
        console.log(`✔ Moved directory to backup: ${displayPath}`);
    }
}

function removeFromFile(filePath, patterns) {
    const fullPath = path.join(root, filePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠ Missing: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, "utf8");
    let updated = false;

    for (const pattern of patterns) {
        if (pattern.test(content)) {
            content = content.replace(pattern, "");
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log(`✔ Updated ${filePath}`);
    }
}

function replaceNoI18n(filePath) {
    const noI18nPath = path.join(root, `${filePath}.no-i18n.ts`);
    const targetPath = path.join(root, `${filePath}.ts`);

    if (!fs.existsSync(noI18nPath)) {
        throw new Error(`Missing fallback file: ${noI18nPath}`);
    }

    // If target exists, backup before overriding
    if (fs.existsSync(targetPath)) {
        moveToDeletedBackup(targetPath);
    }

    fs.renameSync(noI18nPath, targetPath);

    console.log(
        `✔ Replaced ${path.basename(noI18nPath)} → ${path.basename(targetPath)}`
    );
}

function updateFeatureFlags() {
    const flagsPath = path.join(root, "src/features/featuresflags.ts");

    if (!fs.existsSync(flagsPath)) {
        console.warn(`⚠ Missing feature flags file: src/features/featuresflags.ts`);
        return;
    }

    let content = fs.readFileSync(flagsPath, "utf8");

    // Matches i18n: true (handles optional spaces/quotes around key and values)
    const updatedContent = content.replace(/(i18n\s*:\s*)true/g, "$1false");

    if (content !== updatedContent) {
        fs.writeFileSync(flagsPath, updatedContent);
        console.log(`✔ Disabled i18n in src/features/featuresflags.ts`);
    }
}

// ─── Main Execution ───────────────────────────────────────────────────────────
function runRemoval() {
    console.log("\nStarting i18n removal process...\n");

    // 1. Flip i18n flag to false
    updateFeatureFlags();

    // 2. Remove (Move) i18n-owned directories
    removeDirectory(path.join(root, "src/features/i18n"));
    removeDirectory(path.join(root, "src/pages/fr"));
    removeDirectory(path.join(root, "src/locales/fr"));

    // 3. Replace fallback utility files (and backup the old ones)
    replaceNoI18n("src/js/getSiteContext");
    replaceNoI18n("src/features/decapCMS/getBlogPosts");
    replaceNoI18n("src/js/routes");

    // 4. Clean up imports and component usages
    removeFromFile("src/components/Settings/Settings.astro", [
        /import\s+TwoLocalesSelect\s+from\s+["']src\/features\/i18n\/LanguageSwitch\/TwoLocalesSelect\.astro["'];?\r?\n/g,
        /\s*<TwoLocalesSelect\s*\/>\r?\n?/g,
    ]);

    removeFromFile("src/pages/index.astro", [
        /import\s+BrowserLanguageRedirect\s+from\s+["']src\/features\/i18n\/LanguageSwitch\/BrowserLanguageRedirect\.astro["'];?\r?\n/g,
        /\s*<BrowserLanguageRedirect\s*\/>\r?\n?/g,
    ]);

    // 5. Create structural execution marker
    fs.writeFileSync(markerPath, new Date().toISOString() + "\n", "utf8");

    console.log("\n✔ i18n removal complete. Originals backed up to scripts/deleted/");
}