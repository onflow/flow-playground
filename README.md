# flow-playground — Browser-based Cadence IDE

[![License](https://img.shields.io/github/license/onflow/flow-playground.svg)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/onflow/flow-playground?include_prereleases&sort=semver)](https://github.com/onflow/flow-playground/releases)
[![Discord](https://img.shields.io/discord/613813861610684416?label=Discord&logo=discord&logoColor=white)](https://discord.gg/flow)
[![Built on Flow](https://img.shields.io/badge/Built%20on-Flow-00EF8B)](https://flow.com)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

Browser-based IDE for writing, compiling, and testing [Cadence](https://cadence-lang.org) smart contracts directly in a browser. Part of the [Flow network](https://flow.com) developer toolchain.

## TL;DR

- **What:** A web-based IDE for authoring, compiling, and testing Cadence smart contracts without local tooling.
- **Who it's for:** Developers learning Cadence, educators teaching Flow, and anyone prototyping contracts in a browser.
- **Why use it:** Zero-install onboarding to Cadence; share projects via URL; iterate on contracts, transactions, and scripts against an embedded Flow emulator.
- **Status:** see [Releases](https://github.com/onflow/flow-playground/releases) for the latest version.
- **License:** Apache-2.0
- **Related repos:** [onflow/cadence](https://github.com/onflow/cadence) · [onflow/flow-cli](https://github.com/onflow/flow-cli) · [onflow/flow-go](https://github.com/onflow/flow-go)
- The reference browser-based Cadence playground for the Flow network, open-sourced since 2020.

## Quick Start

Hosted version (recommended):

- Open https://play.flow.com in a browser and start a new project.

Run locally (for contributors):

```shell
git clone git@github.com:onflow/flow-playground.git
cd flow-playground
npm install
```

Rename `.env.local` to `.env`, then start the API and the frontend:

```shell
docker run -e FLOW_DEBUG=true -e FLOW_SESSIONCOOKIESSECURE=false -p 8080:8080 gcr.io/dl-flow/playground-api:latest
npm run start
```

The Playground is then available on http://localhost:3000.

## Features

- Web-based editor for Cadence contracts, transactions, and scripts.
- Embedded Flow emulator for running code without installing a local node.
- Starter templates to help newcomers learn Cadence.
- Shareable project URLs for tutorials and collaboration.
- Static, portable frontend ("JAM stack") designed for easy deployment.

## Example

A typical workflow in the Playground:

1. Open https://play.flow.com and create a new project.
2. Pick a template (contract, transaction, or script) from the editor.
3. Deploy the contract to one of the in-browser accounts.
4. Run a transaction or script against the deployed contract.
5. Share the project URL with teammates or learners.

## How It Works

The Flow Playground is shipped as a static frontend (React + TypeScript) backed by a Playground API that wraps the [Flow Emulator](https://developers.flow.com). Building the frontend as a static site keeps it portable, fast to deploy, and easy to host on different platforms. See [RUNBOOK.md](RUNBOOK.md) for deployment details and [CONTRIBUTING.md](CONTRIBUTING.md) for contributor workflow, including the `staging` branch convention.

## VS Code debugging

If you are using VS Code, the following debug configuration is known to work with workspaces:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "chrome",
      "request": "launch",
      "port": 9229,
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*",
        "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///*": "*"
      },
      "trace": true
    }
  ]
}
```

## Contributing

See the [Contribution Guidelines](CONTRIBUTING.md).

Git workflow notes:

- Use merge squashing rather than commit merging ([background](https://blog.dnsimple.com/2019/01/two-years-of-squash-merge/)).
- The `staging` branch is the base branch and contains the code deployed at https://play.staging.flow.com.

## Deployment

The runbook contains details on [how to deploy the Flow Playground web app](RUNBOOK.md).

## FAQ

**What is the Flow Playground?**
A browser-based IDE for writing, compiling, and testing Cadence smart contracts without installing local tooling.

**Where is the hosted version?**
The Playground is available at https://play.flow.com.

**Which language does it support?**
Cadence, the resource-oriented smart contract language for Flow. See the [Cadence language reference](https://cadence-lang.org).

**Do I need to install anything to use it?**
No. The hosted Playground runs entirely in the browser. Local setup is only needed if you want to contribute to the Playground itself.

**How do I run the Playground locally?**
Clone the repo, run `npm install`, start the API via Docker, and run `npm run start`. See the Quick Start section above.

**Where can I learn Cadence?**
The [Flow developer portal](https://developers.flow.com) and the [Cadence language reference](https://cadence-lang.org) are the canonical learning resources.

**How do I report a bug or request a feature?**
Open an issue on this repository, or discuss in the [Flow Discord](https://discord.gg/flow) or [Flow Forum](https://forum.flow.com).

## Community

- [Flow Discord](https://discord.gg/flow)
- [Flow Forum](https://forum.flow.com)
- [Flow Improvement Proposals (FLIPs)](https://github.com/onflow/flips)

## About Flow

This repo is part of the [Flow network](https://flow.com), a Layer 1 blockchain built for consumer applications, AI Agents, and DeFi at scale.

- Developer docs: https://developers.flow.com
- Cadence language: https://cadence-lang.org
- Community: [Flow Discord](https://discord.gg/flow) · [Flow Forum](https://forum.flow.com)
- Governance: [Flow Improvement Proposals](https://github.com/onflow/flips)
