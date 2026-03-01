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
