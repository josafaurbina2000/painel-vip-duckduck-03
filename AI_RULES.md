# AI Development Rules & Guidelines

Welcome to the **BF4 VIP Panel - DUCK DUCK** codebase. Please follow these rules and architectural guidelines when adding features or modifying existing code.

## Tech Stack Overview

- **Frontend Framework**: React 18 with TypeScript, built and bundled via Vite.
- **Backend & Database**: Supabase (utilizing Postgres, Row-Level Security, and public access policies).
- **Styling**: Tailwind CSS, customized with dark and light themes (controlled via `next-themes`).
- **UI Components**: Radix UI primitives wrapped as shadcn/ui components (located in `src/components/ui/`).
- **Icons**: Lucide React for modern, consistent, and scalable vector icons.
- **Routing**: React Router DOM (v6) for client-side single-page application navigation.
- **State Management & Caching**: TanStack React Query (v5) for efficient server-state management.
- **Progressive Web App (PWA)**: Powered by `vite-plugin-pwa` for offline capabilities and installation banners.
- **Utility Libraries**: `date-fns` for robust date utilities, `zod` for schema validation, and `sonner` / `react-toast` for rich toast notifications.

---

## Codebase Architecture & File Rules

1. **Keep Components Small**: Maintain single-responsibility components under 100 lines of code. When components grow beyond this, refactor them into smaller sub-components.
2. **Directory Structure**:
   - Page-level views must go in `src/pages/` (e.g., `Index.tsx`, `Dashboard.tsx`, `VIPList.tsx`).
   - Reusable layout or feature components go in `src/components/` (e.g., `Header.tsx`, `StatsCard.tsx`).
   - Hooks go in `src/hooks/` (e.g., `useVIPs.ts`).
   - Configuration and utilities belong in `src/utils/` and `src/lib/`.
3. **Responsive Design First**: Every UI component must be fully responsive using Tailwind's breakpoint modifiers (e.g., `md:`, `lg:`). Use the `useIsMobile` hook where layout variations cannot be resolved purely with CSS.
4. **No Placeholders**: Never introduce incomplete features, "TODO" blocks, or console statement fallbacks in production-ready files. All features must be fully functional.

---

## Library & API Usage Rules

### 1. Styling & Theme
- **Rule**: Always use Tailwind utility classes. Do not create inline `style` props unless styling dynamic CSS variables.
- **Theme Hooks**: Use the custom theme context or `next-themes` to handle dark/light transitions. Ensure components support class-based dark mode (`.dark`).

### 2. UI Components (shadcn/ui)
- **Rule**: Prioritize the existing components in `src/components/ui/` (e.g., `Button`, `Card`, `Dialog`, `Select`). 
- **Rule**: Do not install third-party component libraries (like Material UI, Bootstrap, or Ant Design) to avoid bloating the bundle.

### 3. Iconography
- **Rule**: Always import icons from `lucide-react`. 
- **Consistency**: Keep icon sizes uniform (typically `w-4 h-4` inside small buttons, `w-5 h-5` for general layout/cards, and `w-12 h-12` or larger for empty-state illustrations).

### 4. Database & State Management
- **Rule**: All database operations must go through the Supabase client defined in `@/integrations/supabase/client`.
- **Database Context**: Use `src/contexts/VIPContext.tsx` and the `useVIP` hook to manage the active state of VIP players. Do not fetch directly from Supabase inside display components if the context can provide or sync that data.
- **Dates**: Database timestamps are ISO strings. Always parse them using `new Date()` and format them using the utility functions in `src/utils/vipUtils.ts` (e.g., `formatDate`, `formatDateTime`).

### 5. Routing
- **Rule**: Define all routes in `src/App.tsx`. Do not create multiple router instances.
- **Navigation**: Use `<Link>` or `useNavigate` from `react-router-dom` for client-side transitions. Never use standard `<a>` tags for internal pages, as this causes a full page reload.

---

## Progressive Web App & Offline Capabilities
- Ensure any action that changes state checks or gracefully handles offline scenarios.
- Make use of `PWAOfflineIndicator.tsx` to communicate network state to the user.