# SolidJSTauri

This  is a streamlined `Tauri` example using `Vite` and `SolidJS`

This example includes:

- [Tauri](https://tauri.app/)
- [JSDoc](https://jsdoc.app/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Proper VSCode Workspace](./my-app/example.code-workspace)

## Usage

> [!IMPORTANT]\
This project uses `pnpm` by default.

```bash
$ pnpm install # or yarn install or npm install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `pnpm tauri dev`

Runs the app in the development mode.<br>

An app should launch on your desktop. 

Alternatively open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `pnpm docs`

Uses `JSDoc` to build a documentation website based on the projects documentation.

### `pnpm lint`

Runs `eslint` on all of the included files.

### `pnpm format`

Uses `Prettier` and the above `pnpm lint` command to lint and then format all included file types.

## Deployment

To build your app, run the following:

```bash
pnpm tauri build
```

Builds the app for production to the `src-tauri/target` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
