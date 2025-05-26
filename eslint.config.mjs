import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
        "next/typescript",
        "plugin:prettier/recommended"
    ),
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...compat.extends("next/core-web-vitals", "next/typescript")[0],
    },
];
