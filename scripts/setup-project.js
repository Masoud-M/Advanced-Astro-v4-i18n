#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import readline from "readline";
import { spawn } from "child_process";

const root = process.cwd();

const featuresFile = join(
    root,
    "src",
    "features",
    "featuresflags.ts"
);

/**
 * Reads the current feature flags from featuresflags.ts
 */
function readFeatureFlags() {
    const content = readFileSync(featuresFile, "utf8");

    const getFlag = (name) => {
        const match = content.match(
            new RegExp(`${name}\\s*:\\s*(true|false)`)
        );

        return match?.[1] === "true";
    };

    return {
        i18n: getFlag("i18n"),
        cms: getFlag("cms"),
        demo: getFlag("demo"),
        darkMode: getFlag("darkMode"),
    };
}

const FEATURES = [
    {
        key: "i18n",
        label: "Multilingual website (i18n)",
        script: "remove-i18n",
    },
    {
        key: "cms",
        label: "Decap CMS and blog functionality",
        script: "remove-decap",
    },
    {
        key: "demo",
        label: "Demo files",
        script: "remove-demo",
    },
    {
        key: "darkMode",
        label: "Dark mode",
        script: "remove-dark-mode",
    },
];

function askQuestion(rl, question, defaultYes = true) {
    const suffix = defaultYes ? " (Y/n): " : " (y/N): ";

    return new Promise((resolve) => {
        rl.question(question + suffix, (answer) => {
            const value = answer.trim().toLowerCase();

            if (!value) {
                resolve(defaultYes);
                return;
            }

            resolve(value === "y" || value === "yes");
        });
    });
}

function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Running ${scriptName}...`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        const child = spawn("npm", ["run", scriptName], {
            stdio: "inherit",
            shell: true,
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(`${scriptName} exited with code ${code}`)
                );
            }
        });
    });
}

async function main() {
    const currentFlags = readFeatureFlags();

    console.log("\nProject Feature Setup\n");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const actions = [];

    for (const feature of FEATURES) {
        if (!currentFlags[feature.key]) {
            console.log(`✓ ${feature.label} is already removed.`);
            continue;
        }

        const keep = await askQuestion(
            rl,
            `Keep ${feature.label}?`
        );

        actions.push({
            ...feature,
            remove: !keep,
        });
    }

    console.log("\nSummary\n");

    for (const action of actions) {
        console.log(
            `${action.remove ? "✗ Remove" : "✓ Keep"} ${action.label}`
        );
    }

    const proceed = await askQuestion(
        rl,
        "\nProceed with these changes?"
    );

    rl.close();

    if (!proceed) {
        console.log("\nCancelled.");
        process.exit(0);
    }

    for (const action of actions) {
        if (!action.remove) continue;

        try {
            await runScript(action.script);
        } catch (error) {
            console.error(`\n❌ ${error.message}`);
            process.exit(1);
        }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Project setup complete.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((error) => {
    console.error("\nFatal error:");
    console.error(error);
    process.exit(1);
});