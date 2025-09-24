# DripDrop.City

## Tech Stack

Backend:

- tRPC for type-safe API communication
- Node.js
- HTTP/HTTPS protocol
- RESTful endpoint structure
- JSON-based temp store

Frontend:

- React: https://react.dev/learn
- Zod: https://zod.dev/
- tRPC: https://trpc.io/docs
- shadcn/ui: https://ui.shadcn.com/docs/components
- Tailwind: https://tailwindcss.com/
- Bun: https://bun.com/
- Docker: https://www.docker.com/

## Code Formatting

This project uses Prettier and ESLint to enforce consistent code formatting and prevent long lines.

### Formatting Rules

- **Line Length**: Maximum 80 characters per line
- **Auto-formatting**: Prettier automatically formats code on save/run
- **Linting**: ESLint catches formatting issues and long lines

### Available Commands

**Format all files:**

```bash
bun run format
```

**Check formatting without making changes:**

```bash
bun run format:check
```

**Run linter to catch issues:**

```bash
bun run lint
```

**Auto-fix linting issues:**

```bash
bun run lint:fix
```

**Fix some long lines automatically:**

```bash
bun run fix-long-lines
```

### Configuration Files

- `.prettierrc` - Prettier configuration (80 char limit, 2-space tabs, etc.)
- `.prettierignore` - Files/directories to exclude from formatting
- `eslint.config.js` - ESLint rules including max-len enforcement
- `.vscode/settings.json` - VSCode workspace settings for formatting on save

### Formatting on Save

The project is configured for automatic formatting on save when using VSCode:

- **Format on Save**: Automatically formats files when you save
- **ESLint Auto-fix**: Automatically fixes linting issues on save
- **Import Organization**: Automatically organizes imports on save

**What Gets Auto-Fixed:**

- ✅ Code formatting (Prettier)
- ✅ Import organization
- ✅ Some ESLint rules (spacing, semicolons, etc.)

**What Requires Manual Fix:**

- ❌ Long lines (max-len) - must be manually broken
- ❌ TypeScript `any` types - must be manually typed
- ❌ Unused variables - must be manually removed or used

**Required VSCode Extensions:**

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

These extensions are automatically recommended when you open the project in VSCode.

## Installation

### Starting the dev container

1. Clone this repo to your local machine.
1. Open it in VSCode (or compatible IDE).
   - **Make sure that the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) is installed in VSCode.**
1. Your IDE will prompt you to open the repo in the devcontainer. Open it.
1. Wait until the devcontainer is fully setup.
1. Once the devcontainer has launched, you're ready to code!
1. If you ever need to re-build the container, open the VSCode Command Pallete and search for "Dev Containers: Rebuild Container"

The devcontainer will automatically:

- Install all dependencies
- Launch the development server

### Development server

The development server is accessible at http://localhost:6173.

## Implementation

### Clothing Rules Engine

The clothing rules engine is built by mapping weather conditions to recommended articles of clothing.

The engine is based on the four criteria that make up a Weather object.

- Temperature
- Condition
- Rain Probability
- Wind Speed in MPH
