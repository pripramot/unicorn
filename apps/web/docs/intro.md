---
sidebar_position: 1
---

# 🦄 GTS Alpha Forensics Platform

Welcome to the **GTS Alpha Forensics** documentation — an AI-powered Digital Forensics & Cybersecurity platform.

## Overview

GTS Alpha Forensics is a comprehensive platform that combines:

- 🤖 **AI Agent Server** — MCP-based tools for OSINT, web intelligence, and security analysis
- 🧠 **Brain Module** — Reasoning engine with chain-of-thought and task planning
- 💾 **Memory System** — Short-term, long-term, and episodic memory for intelligent context
- 🎯 **Skills Registry** — Pluggable skill system for forensics, OSINT, and security
- 🔗 **MCP A2A** — Agent-to-Agent protocol for multi-agent collaboration
- 🔌 **Multi-Provider APIs** — Google AI, OpenAI, Anthropic, SerpAPI, Apify

## Architecture

This project uses a **monorepo** structure powered by **pnpm workspaces** and **Turborepo**:

```
apps/
  web/              → Docusaurus documentation site
  agent-server/     → Python FastMCP agent server

packages/
  brain/            → AI reasoning & planning
  memory/           → Memory management system
  skills/           → Skill registry & executor
  mcp-a2a/          → Agent-to-Agent protocol
  api-providers/    → Multi-provider API abstraction
```

## Getting Started

### Prerequisites

- **Node.js** >= 20.0
- **pnpm** >= 10.0
- **Python** >= 3.11

### Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build
```

## 🔒 Access Notice

> ⚠️ **ระบบนี้อยู่ระหว่างการส่งมอบ — เฉพาะผู้ได้รับอนุญาตเท่านั้น**
>
> This system is under delivery. Authorized access only.
