# Purpose

This document will try to gather all the valuable information, debugging processes and insights developers could get
during the process of Playground improvement.

# [Major LSP Refactoring - PR #238](https://github.com/onflow/flow-playground/pull/238)

## Problem

The work encapsulated in that PR was targeted at the problem of state de-sync: contract could be updated/redeployed, but
script importing said contract would not be aware of newly created fields or methods. As a result, user would need to
refresh webpage to be able to use updated contract code.

Said problem existed for quite some time in Playground and was not properly addressed because of lack of resources and
priorities in other Developer Tools.

## Hypothesis

One of the components is caching or translates outdated code into LSP (_Language Server Protocol_).

## Development Challenges

- LSP Client and Server are nested deeply into React tree, which leads to unnecessary code updated and server/client
  restarting on each state change.
- Existing Webpack, eslint and Typescript compiling would create slow pipeline, resulting in 40 seconds update even on a
  minuscule change
- No `hot-reload`, meaning you will lose some changes you've done to the application state and slowing down testing
  process
- No automatic test pipeline

## Approach

### Make Typescript Less Strict

Until the source of the problem is not identified we disabled Typescript strict checks to speed up linter (even for a
bit) and compiler. This allowed us to focus on solution and not fighting the type system.

### LSP Components as React Context

LSP components were moved into separate React context provider (right below Project provider, because we need that
dependency to pass code to server) to allow any components located below in the tree to access the values and methods
without `props drilling` and unnecessary updates.

### Decouple LSP components and Monaco Editor

Monaco Editor is structured in such a way that you don't need to directly connect it to LSP components. Previous
implementation required language server dependency so that "control panel" could get a list of arguments by sending a
specific message.

## Findings

### Callback Closures

#### Problem

Setting up callbacks on the language client would create a closure around current props/state of the components. All the
following methods used within said callbacks will use old values.

#### Solution

Language Client callback setters will return a `Disposable` object. With help of `useRef` and `useEffect` React hooks we
keep them updated every time important dependency changes - usually it's either `project.accounts` or `languageServer`
value.

### Caching

#### Problem

Quick search through [Cadence repository](https://github.com/onflow/cadence) was fruitless to uncover any caching
mechanism for caching the code during import resolvers, so we dismissed the idea that something is wrong with Language
Server and focused on the webapp itself. But after sprinkling `getAddressCode` method - which language server is setting
during initialization - with a bit of `console.log` calls, we've spotted that Language Server never fetches code twice
for the same contract from account. Another engineer decided to scratch that one for a bit, while we were patching other
"holes" in webapp. In the end he found that there is indeed a caching mechanism, which was preventing re-fetching of
contract code.

Incorporating fix for the caching would allow us to instantiate LSP components single time, when the app starts and
eliminate the need to restart language server every time the contract code changes. This will be done in following PRs,
when new package for Cadence language server is released.

#### Solution

We identified that out of two LSP components - client and server - it's server that responsible for caching and updates.
Using `useEffect` React hook we restart language server every time account's contract code is changed (value change is
actually debounced, so we don't need to it as user types, but only when it's saved).

### Old Editor State

#### Problem

Let's say you use some non-existing method in your transaction/script. Editor would highlight you the issue - show
`diagnostics` - using LSP components. Then you switch to contract code, edit something and redeploy. Language server
restarted, but as you switch back to the script you still see the error. That's because editor does not know anything
about changes in the imported code and "thinks" everything is the same.

#### Solution

We've used the same trick as previously implemented in VS Code extension - add new line character at the eof, them add
timeout and revert code to original state. This will "trick" editor into thinking that code was changed and need to be
checked for errors again, catching new changes on contract in the process. Win-win! :)
