# Contributing to the Playground

The following is a set of guidelines for contributing to the Flow Playground Project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[Getting Started](#project-overview)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

[Styleguides](#styleguides)

- [Git Commit Messages](#git-commit-messages)
- [JavaScript Styleguide](#javascript-styleguide)
- [React Styleguide](#javascript-styleguide)
- [Theme & CSS Styleguide](#theme-and-css-styleguide)

[Additional Notes](#additional-notes)

## **Project Overview**

- The Playground Front-End is built using React
- CSS is done using a combination of `@emotion` and `theme-ui` (For legacy reasons)
- The Playground communicates with the Flow blockchain emulator via a GraphQL API. GraphQL types (Typescript) are managed (and generated) using: [https://graphql-code-generator.com/docs/plugins/typescript](https://graphql-code-generator.com/docs/plugins/typescript)

### **Local development**

Instructions for local development can be found in the `README.md`

## How Can I Contribute?

### Reporting Bugs

#### Before Submitting A Bug Report

- **Search existing issues** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't just say what you did, but explain how you did it**.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

Provide more context by answering these questions:

- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

- **What's the name and version of the OS you're using**?
- **What's the name and version of the Web Browser you're using**?

### Suggesting Enhancements

#### Before Submitting An Enhancement Suggestion

- **Perform a cursory search** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs**. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to Playground users.

### Your First Code Contribution

Unsure where to begin contributing to the Playground? You can start by looking through these `good-first-issue` and `help-wanted` issues:

- [Beginner issues][good-first-issue] - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than `good-first-issue` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

The process described here has several goals:

- Maintain code quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Playground UX
- Enable a sustainable system for the Playground's maintainers to review contributions

Please follow the [styleguides](#styleguides) to have your contribution considered by the maintainers.
Reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

Before contributing, make sure to examine the project to get familiar with the patterns and style already being used.

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

This project uses TypeScript. TypeScript rules are defined in `tsconfig.js` These rules must not be overridden, unless absolutely necessary.

All TypeScript must adhere to [JavaScript Standard Style](https://standardjs.com/). This is enforced in the project by the [`prettier-standard`](https://github.com/sheerun/prettier-standard) package.

- Place `imports` in the following order:
  - Libraries starting with `React`
  - Local modules
  - Components
  - Styles and style related imports
  - Constants

### React Styleguide

- Prefer **stateless functional components** over `class` components.
- Use typescript type annotations, not `PropTypes`.
- Separate presentational components and container components [following these suggestions](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

### Theme and CSS Styleguide

This project uses [**Theme UI**](https://theme-ui.com/)

- Use values from `theme.js` when creating components
- If a value does not exist in `theme.js` consider changing those values, or augmenting `theme.js`
- Avoid inline styles where possible

### Additional Notes

Thank you for your interest in contributing to the Flow Playground!
