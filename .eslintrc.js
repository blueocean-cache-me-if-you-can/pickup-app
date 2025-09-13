module.exports = {
    root: true,
    extends: ["airbnb", "airbnb/hooks", "plugin:react/recommended", "plugin:jsx-a11y/recommended"],
    env: { browser: true, es2021: true },
    settings: {
        react: { version: "detect" },
        "import/resolver": { node: { extensions: [".js", ".jsx"] } }
    },
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    overrides: [
        {
            files: ["client/src/**/*.{js,jsx}"],
            env: { browser: true, node: false },
            rules: {
                "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
                "react/prop-types": "off",
                "jsx-quotes": ["error", "prefer-single"],
            }
        }
    ]
};