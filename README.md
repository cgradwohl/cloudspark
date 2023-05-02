# Cloudspark Monorepo

## Workspace Commands

Create workspace `workspace-a`
`npm init -w workspace-a`
Create workspace `a` in the `./packages` folder
`npm init -w ./packages/a`

Install the `abbrev` package in workspace `a`
`npm install abbrev -w a`

Run the `test` command in workspace `a`
`npm run test --workspace=a`

Run the `test` command in workspace `a` and workspace `b`
`npm run test --workspace=a --workspace=b`

Run the `test` command in all workspaces (Commands will be run in each workspace in the order they appear in the root package.json)
`npm run test --workspaces`

Run the `test` command in all workspaces if it exists
`npm run test --workspaces --if-present`
