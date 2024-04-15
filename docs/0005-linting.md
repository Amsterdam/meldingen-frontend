# Linting

We use linters and code formatters in our project, for a number of reasons:

- They help you catch errors early in the development process, when they are easier and cheaper to fix.
- They can help promote coding standards and best practices within a development team,
  ensuring that code is consistent and maintainable.
- They can help you identify potential security vulnerabilities in your code, reducing the risk of a breach.

We use linters for JavaScript / TypeScript files, style files and Markdown files.

For JavaScript / TypeScript we use ESLint and the TypeScript compiler itself.
For style files we use Stylelint.
For Markdown files we use Markdownlint.

We use Prettier for code formatting of all these files.

These linters and formatters are run:

- on save (requiring some configuration by developers, see below)
- pre-commit
- on a push to `main` or `develop`
- when opening a PR

## Setting up linting and formatting on save

If you use [Visual Studio Code](https://code.visualstudio.com/),
you can use the following extensions for automatic linting and formatting:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

To enable correct validation and to fix lint/style errors on save, add this to your VSCode `settings.json`:

```json
  "css.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "scss"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true,
    "source.fixAll.markdownlint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
```
