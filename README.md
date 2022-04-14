# Flow Playground

The Flow Playground is the best way to learn and try Cadence. For newcomers to Flow,
the [Flow Developer Documentation](https://docs.onflow.org) includes a guide on how to use the Playground.

## Philosophy

### How It's Built

We built the Flow Playground as a static website or typical "JAM stack" website because of these properties:

- Portability. It is easy to move a static website GUI between platforms if desired
- We want to have the ability to deploy the Playground on peer-to-peer networks like IPFS or DAT
- Fast build and deploy cycles
- We want to maximize the amount of potential contributions

### What is the Playground?

We want the Playground to have features that help you build on Flow. We also want to balance functionality with learning.

The Playground is a learning tool first and an awesome development tool second, although the two go hand-in-hand.

## Contributing

### Read the [Contribution Guidelines](CONTRIBUTING.md)

### Git Workflow

- Use merge squashing, not commit merging [eg. here](https://blog.dnsimple.com/2019/01/two-years-of-squash-merge/). Squash merge is your friend.
- The `staging` branch is the base branch and contains the code deployed at https://play.staging.onflow.org.

## Developing

### Pre-requisites

You'll need to have Docker installed to develop.

### Installation

Clone the repo

```shell script
git clone git@github.com:onflow/flow-playground.git
```

Install dependencies

```
npm install
```

Rename `.env.local` to `.env`

Start the API (Flow Emulator and services)

```
docker run -e FLOW_DEBUG=true -e FLOW_SESSIONCOOKIESSECURE=false -p 8080:8080 gcr.io/dl-flow/playground-api:latest
```

Start the React app

```
npm run start
```

✨ The Playground is running on localhost:3000 ✨

If you are using VSCode, you can use this debugging config (works with workspaces)

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

## Deployment

The runbook contains details on [how to deploy the Flow Playground web app](RUNBOOK.md).
