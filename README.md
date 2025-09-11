# Day AI Take-Home Assignment

## Tech Stack

Backend:

- HTTP backend
- tRPC for type-safe API communication
- JSON-based temp store

Frontend:

- React
- Zod
- `<Button />`, `<Input />`, `<Card />`, `<Checkbox />`, `<RadioGroup />` and `<Form />` components for example (shadcn/ui)
- React Router 7
- Tailwind CSS

- React: https://react.dev/learn
- tRPC: https://trpc.io/docs
- shadcn/ui: https://ui.shadcn.com/docs/components/radio-group
- Tailwind: https://tailwindcss.com/
- Bun: https://bun.com/
- Docker: https://www.docker.com/

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
