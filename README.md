# Tetris Game

A classic Tetris game built with Angular. Play the timeless puzzle game where you arrange falling blocks to clear lines and score points.

## Live Demo

🎮 [Play Tetris Game](https://tvietnhat.github.io/tetris-game/)

## Features

- Classic Tetris gameplay
- Score tracking
- Line clearing mechanics
- Responsive design
- Modern UI built with Angular

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow is configured in `.github/workflows/deploy.yml`.

### Manual Deployment

To manually deploy to GitHub Pages:

1. Build the project for production:
   ```bash
   npm run build:prod
   ```

2. The built files will be in the `dist/tetris-game/browser/` directory.

### GitHub Pages Setup

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. The site will be automatically deployed when you push to the main branch

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
