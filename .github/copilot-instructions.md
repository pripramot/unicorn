# Repository Instructions for Copilot (GTS Alpha Forensics)

This is a **monorepo** powered by **pnpm workspaces** and **Turborepo**.

## 1. Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: Docusaurus v3.9.2 (TypeScript, React) in `apps/web/`
- **Backend**: Python FastMCP agent server in `apps/agent-server/`
- **Packages**: TypeScript packages in `packages/` (brain, memory, skills, mcp-a2a, api-providers)

## 2. Build & Validation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Test all packages
pnpm test
```

For the Python agent server:
```bash
cd apps/agent-server
pip install -r requirements.txt
python main.py
```

## 3. Project Layout

```
apps/web/                    → Docusaurus site (pnpm build)
apps/agent-server/           → Python FastMCP server (python main.py)
packages/brain/              → AI reasoning & planning (TypeScript)
packages/memory/             → Memory system (TypeScript)
packages/skills/             → Skill registry (TypeScript)
packages/mcp-a2a/            → Agent-to-Agent protocol (TypeScript)
packages/api-providers/      → Multi-provider APIs (TypeScript)
config/tsconfig/             → Shared TypeScript config
config/eslint/               → Shared ESLint config
```

## 4. Priority Files for Context
1. `README.md` — Project overview and setup instructions
2. `package.json` — Root workspace config
3. `pnpm-workspace.yaml` — Workspace definitions
4. `turbo.json` — Build pipeline config
5. `.env.example` — Required environment variables
6. `AGENTS.md` — AI agent configuration
