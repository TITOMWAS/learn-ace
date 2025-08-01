# Overview

This is a fullstack learning analytics application built for tracking and analyzing quiz/exam performance. The system helps students monitor their academic progress by recording quiz scores, identifying weak areas, and providing insights through analytics and AI-powered exam paper analysis. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom educational color palette (calming blue theme) and CSS variables
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build System**: esbuild for production builds with external package bundling
- **API Design**: RESTful API structure with /api prefix for all routes

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Local Storage**: Browser localStorage for user authentication state and temporary data
- **Session Storage**: In-memory storage implementation for development/demo purposes

## Authentication and Authorization
- **Strategy**: Simple username/password authentication with localStorage persistence
- **Session Management**: Client-side session state management
- **User Model**: Basic user schema with username and password fields
- **Access Control**: Route-based protection using React hooks and navigation guards

## External Dependencies

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Grok AI**: Optional AI service integration for exam paper analysis and weak area detection
- **Replit**: Development platform integration with runtime error overlay and cartographer plugin

### Key Libraries
- **UI Components**: Extensive Radix UI component library for accessibility-first interface
- **Validation**: Zod for runtime type checking and schema validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Charts**: Recharts for data visualization and analytics displays
- **File Handling**: Built-in browser File API for image upload functionality
- **Styling**: class-variance-authority and clsx for conditional CSS class management

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server with HMR and optimized builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **ESLint/Prettier**: Code quality and formatting (implied by project structure)

The application follows a monorepo structure with shared TypeScript definitions between client and server, enabling type safety across the full stack. The architecture prioritizes developer experience with hot reloading, type checking, and modern tooling while maintaining simplicity for educational use cases.