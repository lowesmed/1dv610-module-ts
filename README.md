# TypeScript CLI Template

Welcome to the **1dv610** TypeScript Command-Line Interface (CLI) template. This repository serves as a clean, pre-configured boilerplate for building robust Node.js console applications with modern tools and best practices.

## 🚀 Features

- **TypeScript, strict mode:** Full static typing with `strict` compiler checks enabled from the start.
- **Modern ECMAScript Modules (ESM):** Full native support for `import`/`export` syntax, resolved via `NodeNext`.
- **Fast local dev loop:** [tsx](https://github.com/privatenumber/tsx) runs `src/app.ts` directly, no build step needed while iterating.
- **Unit Testing:** Pre-configured with [Vitest](https://vitest.dev) for blazing-fast test execution, including native TypeScript support.
- **Linting & Code Quality:** Strict code analysis using [ESLint](https://eslint.org) integrated with custom `@lnu/eslint-config` rules, including its TypeScript layer.
- **Code Formatting:** Automatic code style management via [Prettier](https://prettier.io).

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have **Node.js** (version 24.12.0 or later, per `engines` in `package.json`) and **Git** installed on your machine.

### Installation & Project Setup

Pick the flow that matches your situation.

#### A. Starting from scratch (no repository yet) — recommended

Use GitHub's built-in template flow — no git commands needed to get a clean, single-commit history:

1. On GitHub, open this template repository and click **Use this template → Create a new repository**.
2. Clone your new repository and move into it:

   ```bash
   git clone <your-newly-created-repository-url>
   cd <your-repository-name>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

GitHub gives your new repository its own single commit copied from this template — no shared history, nothing to merge or squash.

> **Note:** This requires the template repository to have **Template repository** enabled under its GitHub Settings → General. If the "Use this template" button isn't available, use flow B instead.

#### B. Importing into an existing repository (empty or not)

Use this flow if you already have a repository — e.g. one provisioned by GitHub Classroom — that you can't or don't want to recreate from a template.

1. Clone your existing repository and move into it:

   ```bash
   git clone <your-existing-repository-url>
   cd <your-repository-name>
   ```

2. If the repository has no commits yet, create an empty initial commit:

   ```bash
   git commit --allow-empty -m "Initial commit"
   ```

   _Note: This step is required for a genuinely empty repository. A branch with zero commits has nothing for `--squash` to diff against, so `git pull --squash` silently falls back to a plain fast-forward — it imports this template's entire internal commit history unmodified instead of collapsing it into one clean commit. An empty commit gives `--squash` a (empty) tree to compare against, so it behaves as intended. Skip this step if the repository already has commits (e.g. an auto-generated README)._

3. **Pull and squash the boilerplate code** from this template repository into your branch:

   ```bash
   git pull git@github.com:1dv610/ts-cli-template.git main --squash --allow-unrelated-histories
   ```

   _Note: Using `--squash` ensures that the boilerplate's internal development history is collapsed into a single, clean starting point in your repository. If your repository already had files (e.g. GitHub auto-created a README or `.gitignore`), this will report a conflict on those files — resolve it by taking the template's version: `git checkout --theirs <file> && git add <file>`._

4. **Commit the imported files** to finalize the import of the boilerplate:

   ```bash
   git commit -m "Initial commit from boilerplate"
   ```

5. **Install the project dependencies:**

   ```bash
   npm install
   ```

6. **Push the clean boilerplate setup** up to your own GitHub repository:
   ```bash
   git push origin main
   ```

---

## 💻 Available Scripts

You can manage the application lifecycle, testing, and formatting using the following npm scripts:

### Running the Application

Runs the main console application entry point (`src/app.ts`) directly via `tsx` — no separate build step needed — optionally passing a name as the first argument:

```bash
npm start
npm start -- "Ada Lovelace"
```

The `bin` entry in `package.json` makes the app runnable as a standalone command once built and linked (`npm run build && npm link`) or installed:

```bash
ts-cli-template "Ada Lovelace"
```

_Note: Rename the `ts-cli-template` key in `package.json`'s `bin` field (and the `name` field) to match your own project when adapting this template._

### Building

Compiles `src/` to plain JavaScript in `dist/`, which is what the `bin` entry and published package run:

```bash
npm run build
```

`dist/` is git-ignored — it's a build artifact, regenerated on demand (the `prepare` script also runs this automatically after `npm install`, so the `bin` command works right away).

### Type Checking

Runs the TypeScript compiler in check-only mode (no output files), including test files:

```bash
npm run typecheck
```

### Running Tests

- **Interactive Watch Mode (Recommended for development):**
  ```bash
  npm test
  ```
- **Single Execution Run:**
  ```bash
  npm run test:run
  ```
- **Run Specific Tests (by matching name patterns):**
  ```bash
  npm run test:match -- <test-name-pattern>
  ```

### Code Linting

Analyze the source code in `src/` for errors, syntax issues, and anti-patterns:

```bash
npm run lint
```

Automatically fix fixable linting issues:

```bash
npm run lint:fix
```

### Formatting

Check if files comply with Prettier styling rules:

```bash
npm run format:check
```

Automatically reformat all source files:

```bash
npm run format
```

---

## 📁 Project Structure

```text
├── src/
│   ├── app.ts       # Main application logic & execution entry point
│   └── app.test.ts  # Unit tests for closely coupled application logic
├── test/               # Integration and system tests (higher-level / E2E test flows)
├── dist/               # Compiled JavaScript output (git-ignored, generated by `npm run build`)
├── tsconfig.json       # Base TypeScript config (strict mode; used by the editor, typecheck, and Vitest)
├── tsconfig.build.json # Build-only config: extends the base, emits to dist/, excludes test files
├── package.json        # Project configuration, scripts, and dependencies
└── LICENSE             # Unlicense (Public Domain dedication)
```

---

## ⚖️ License

This project is released into the public domain under the **Unlicense**. You are free to copy, modify, publish, and distribute this boilerplate code in any way you see fit without any restrictions.
