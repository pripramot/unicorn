# Repository Instructions for Copilot (Universal)

This document instructs the AI agent to dynamically analyze the repository context before generating code.

## 1. Dynamic Context Discovery (REQUIRED)
**Before answering any prompt, you MUST scan the repository root to identify the tech stack:**

* **Identify Language & Framework:**
    * Check `package.json` (Node.js/JS/TS).
    * Check `requirements.txt`, `pyproject.toml`, or `Pipfile` (Python).
    * Check `go.mod` (Go).
    * Check `pom.xml` or `build.gradle` (Java).
* **Identify Key Libraries:** Look for major dependencies (e.g., React, FastAPI, Django, Pandas, Tailwind) in the config files above and align your code style with them.

## 2. Universal Build & Validation Protocols

**Infer the build command based on the detected files:**

* **Node.js/JS:**
    * If `package-lock.json` exists -> Use `npm`.
    * If `pnpm-lock.yaml` exists -> Use `pnpm`.
    * **Standard Chain:** Install -> Lint -> Build -> Test.
    * *Command:* `npm install && npm run lint && npm run build` (verify script names in `package.json` first).

* **Python:**
    * Check for virtual environments (`venv`, `.venv`, `env`).
    * **Standard Chain:** Install reqs -> Lint (flake8/pylint) -> Test (pytest).
    * *Command:* `pip install -r requirements.txt && pytest`.

* **General Rule:**
    * If a `Makefile` exists, read it to understand the exact build targets.
    * **Always** validate that your generated code passes the project's existing linting rules.

## 3. Project Layout & Architecture Navigation

* **Map the Structure:**
    * Locate the entry point (e.g., `src/index.js`, `main.py`, `src/main.ts`).
    * Identify where business logic resides (often `src/services`, `lib/`, or `controllers/`).
    * Identify where UI components reside (often `src/components`).

* **Follow Existing Patterns:**
    * **Style Consistency:** Match the existing indentation, variable naming conventions (camelCase vs snake_case), and file structure.
    * **Configuration:** Look for `.env.example` to understand required environment variables. Do not hardcode secrets.

## 4. Priority Files for Context
**Read these files first to ground your responses:**
1.  `README.md` (Project goals and manual setup instructions).
2.  **Dependency Config** (`package.json`, `requirements.txt`, etc.).
3.  **Linter Config** (`.eslintrc`, `.prettierrc`, `ruff.toml`) to ensure code compliance.
