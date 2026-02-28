# Electron Hono React Template

A robust, modern template for building cross-platform desktop applications using **Electron**, **React**, and **Hono**. This template leverages **TypeScript** for type safety, **Vite** for fast builds, and **Tailwind CSS** for styling, along with **Drizzle ORM** for efficient SQLite database management.

## 🚀 Features

- **Electron**: Build cross-platform desktop apps with JavaScript, HTML, and CSS.
- **React**: Modern UI development with the latest React 19 features.
- **Hono**: Ultrafast web framework, used here for handling backend logic/worker processes.
- **TypeScript**: Standardized type safety across the entire stack.
- **Vite & Electron-Vite**: Lightning-fast development server and build tool.
- **Tailwind CSS (v4)**: Utility-first CSS framework for rapid UI design.
- **Drizzle ORM**: Lightweight and type-safe ORM for SQLite/LibSQL.
- **Zod**: TypeScript-first schema declaration and validation.
- **Electron Builder**: Ready-to-use configuration for packaging apps for Windows, macOS, and Linux.

## 🛠️ Tech Stack

- **Runtime**: [Electron](https://www.electronjs.org/), [Node.js](https://nodejs.org/)
- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Logic**: [Hono](https://hono.dev/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/), [LibSQL](https://github.com/tursodatabase/libsql)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## 📦 Project Structure

```text
├── electron.vite.config.ts  # Vite configuration for Electron
├── drizzle.config.ts        # Drizzle ORM configuration
├── electron-builder.yml     # Electron Builder configuration
├── src/
│   ├── main/                # Main process code (Electron & Hono)
│   │   ├── db/              # Database schema and migrations
│   │   ├── routes/          # API routes
│   │   └── worker.ts        # Worker process entry point
│   ├── preload/             # Preload scripts
│   └── renderer/            # Renderer process code (React App)
│       ├── src/
│       │   ├── components/  # React components
│       │   └── main.tsx     # React entry point
│       └── index.html
└── out/                     # Build output directory
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v20 LTS or higher recommended)
- npm (or bun/yarn/pnpm)

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd electron-hono-react-template
npm install
```

### Development

Start the app in development mode with hot-reload:

```bash
npm run dev
```

### Database Management

Commands for managing your local SQLite database with Drizzle:

- **Generate Migrations**:
  ```bash
  npm run drizzle:generate
  ```
- **Open Drizzle Studio** (Visual database editor):
  ```bash
  npm run drizzle:studio
  ```
- **Push Changes** (Prototyping):
  Push schema changes directly to the database without generating migrations.
  ```bash
  npm run drizzle:push
  ```

### Testing

Run the test suite using Vitest:

```bash
npm run test
```

### Linting & Formatting

- **Lint Code**:
  ```bash
  npm run lint
  ```
- **Format Code**:
  ```bash
  npm run format
  ```

## 🏗️ Building for Production

Compile and package the application for your operating system:

### Windows

```bash
npm run build:win
```

### macOS

```bash
npm run build:mac
```

### Linux

```bash
npm run build:linux
```

The packaged application will be available in the `dist/` directory.

## 📝 Configuration

- **Environment Variables**: Manage `.env` files for sensitive configs.
- **Electron Builder**: Modify `electron-builder.yml` to change app metadata, icons, and build settings.

## 🤝 Contributing

This is not open for contributions.

## 📄 License

[MIT](LICENSE)
