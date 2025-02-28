# CodeTask

A modern task management application designed specifically for developers, focusing on code review feedback and PR changes. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Now in Public Beta](https://img.shields.io/badge/status-public%20beta-green)

## Features

- 🎯 **Code-First Approach**: Built for developers with syntax highlighting, code snippets, and Git integration
- 💾 **Reliable Storage**: Choose between local storage or Supabase for secure data persistence
- ⌨️ **Keyboard Driven**: Lightning-fast keyboard shortcuts for efficient task management
- 🎨 **Modern UI**: Beautiful, responsive interface built with Shadcn UI and Tailwind CSS
- 🚀 **Performance**: Built with React Server Components and Next.js App Router for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: Supabase (optional)
- **State Management**: React Hooks
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codetask.git
cd codetask
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Creating Tasks**
   - Add tasks with code snippets
   - Attach PR links
   - Add tags for organization

2. **Managing Tasks**
   - Use keyboard shortcuts for quick navigation
   - Filter tasks by status, tags, or priority
   - Track progress with completion status

3. **Code Integration**
   - Syntax highlighting for code snippets
   - Direct links to GitHub PRs
   - Copy code snippets with one click

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
