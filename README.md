# 🦄 GTS Alpha Forensics

> AI-Powered Digital Forensics & Cybersecurity Platform

[![CI](https://github.com/pripramot/unicorn/actions/workflows/ci.yml/badge.svg)](https://github.com/pripramot/unicorn/actions/workflows/ci.yml)

## 🔒 Access Notice

> **ระบบนี้อยู่ระหว่างการส่งมอบ — เฉพาะผู้ได้รับอนุญาตเท่านั้น**
>
> This system is under delivery. Authorized access only.

## Overview

GTS Alpha Forensics is a comprehensive AI agent platform for digital forensics and cybersecurity. Built with a modern monorepo architecture, it combines documentation, AI agents, and multi-provider API integrations.

## 🏗️ Architecture

```
unicorn/
├── apps/
│   ├── web/                    # 🌐 Docusaurus documentation site
│   └── agent-server/           # 🤖 Python FastMCP agent server
│
├── packages/
│   ├── brain/                  # 🧠 AI reasoning & task planning
│   ├── memory/                 # 💾 Short-term, long-term, episodic memory
│   ├── skills/                 # 🎯 Pluggable skill registry & executor
│   ├── mcp-a2a/                # 🔗 Agent-to-Agent protocol
│   └── api-providers/          # 🔌 Google AI, OpenAI, Anthropic, SerpAPI, Apify
│
├── config/                     # Shared configurations
│   ├── tsconfig/               # TypeScript config
│   └── eslint/                 # ESLint config
│
└── .github/
    └── workflows/              # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0
- **pnpm** >= 10.0
- **Python** >= 3.11

### Installation

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Run tests
pnpm test

# Lint all packages
pnpm lint
```

### Agent Server

```bash
cd apps/agent-server

# Install Python dependencies
pip install -r requirements.txt

# Start the MCP server
python main.py
```

## 📦 Packages

### 🧠 Brain (`@gts/brain`)
Reasoning engine with chain-of-thought processing and hierarchical task planning.

### 💾 Memory (`@gts/memory`)
- **Short-term Memory:** Working memory for conversation context
- **Long-term Memory:** Persistent storage with semantic search
- **Episodic Memory:** Experience-based learning from past interactions

### 🎯 Skills (`@gts/skills`)
Pluggable skill system with registry and executor for:
- OSINT Investigation
- Mobile Forensics Analysis
- Security Assessment
- Report Generation
- Web Intelligence

### 🔗 MCP A2A (`@gts/mcp-a2a`)
Agent-to-Agent protocol for multi-agent collaboration:
- Agent Discovery & Registration
- Message Routing & Queuing
- Task Delegation
- Shared Context

### 🔌 API Providers (`@gts/api-providers`)
Multi-provider abstraction layer:
- **Google AI** (Gemini Pro) — one.google subscription
- **OpenAI** (GPT-4/5)
- **Anthropic** (Claude)
- **SerpAPI** — Search intelligence
- **Apify** — Web scraping automation

## 🤖 Agent Server Tools

The MCP agent server provides 13+ integrated tools:

| Tool | Description |
|------|-------------|
| `google_search` | Google search via SerpAPI |
| `social_search` | Social media intelligence |
| `apify_actor_call` | Web scraping automation |
| `web_analysis_check` | OSINT website analysis |
| `verify_security_standard` | Security best practices |
| `framer_design_sync` | Design system sync |
| `openai_mcp_agent_call` | GPT Agent with MCP |
| `openai_agent_call` | OpenAI Responses API |
| `line_voom_post` | LINE VOOM management |
| `ux_pilot_gen_ui` | AI UI generation |
| `cloudflare_shield_status` | DDoS protection |
| `issue_agency_policy` | Agency policy management |

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

See `.env.example` for all required variables.

## 📝 License

Copyright © 2026 GTS Alpha Forensics AI Team. All rights reserved.
