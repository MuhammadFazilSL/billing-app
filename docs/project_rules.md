# Project Rules & Development Guidelines

This document establishes the permanent development rulebook, styling rules, coding conventions, and deployment standards for the SaaS Billing & Shop Management System.

---

## 1. General Rules

### 1.1 Coding Philosophy
* **Maintainability & Scalability First**: Code must be written with the assumption that the system will scale to thousands of tenants and run for years. Code readability is prioritized over writing speed.
* **Composition over Inheritance**: Prefer combining small, focused elements rather than building complex inheritance hierarchies.

### 1.2 Architectural Principles
* **Clean Architecture**: Enforce strict separation of concerns. The system is split into distinct logical layers:
  * **Presentation Layer**: React components, views, and controllers.
  * **Application Layer**: Services, business logic, DTOs, and validation logic.
  * **Domain Layer**: Core models, interfaces, and business rules.
  * **Infrastructure Layer**: Database (Prisma), Cache (Redis), Queue (BullMQ), and external integrations.
* **SOLID Principles**:
  * *Single Responsibility (SRP)*: A component, class, or service must do exactly one thing.
  * *Open/Closed (OCP)*: Software entities should be open for extension but closed for modification.
  * *Liskov Substitution (LSP)*: Subtypes must be substitutable for their base types.
  * *Interface Segregation (ISP)*: Prefer many client-specific interfaces over one general-purpose interface.
  * *Dependency Inversion (DIP)*: Depend on abstractions, not concretions.
* **DRY (Don't Repeat Yourself)**: Avoid duplicated code blocks. Extract shared calculations, validators, and formatting logics into reusable helpers.
* **KISS (Keep It Simple, Stupid)**: Do not over-engineer. Write straightforward code before optimizing. Avoid premature optimizations.
* **Feature-Based Architecture**: Group directories by feature domain (e.g., `products`, `billing`) instead of technical type (e.g., all controllers in one folder, all services in another).

---

## 2. Frontend Rules (React & TypeScript)

### 2.1 Component Guidelines
* **Size Constraint**: Components must not exceed **300 lines of code**. If a component grows larger, extract sub-elements, forms, or custom hooks.
* **Functional Components**: All components must be defined as functional components using the `const ComponentName: React.FC<Props>` pattern.
* **Pure Components**: Keep rendering logic pure. Side effects must be contained inside custom hooks or `useEffect`.
* **State Co-location**: Keep state as close to where it is used as possible. Do not put component-local state in Redux.

### 2.2 Custom Hooks
* **Logic Extraction**: Extract complex fetching, form handling, or calculations into custom hooks (e.g., `useProductList.ts`, `usePOSCart.ts`).
* **Naming**: Prefix custom hooks with `use`.

### 2.3 State Management
* **Redux Toolkit**: Restricted to global, cross-component UI state (e.g., sidebar toggles, shopping cart states, active POS sessions).
  * Use slice-based organization.
  * Define explicit selectors for performance optimization.
* **TanStack Query (Server State)**: All backend API calls (queries/mutations) must run through TanStack Query. Do not store API data in Redux.
  * Define clear query keys globally using a query key factory.

### 2.4 Styling
* **Tailwind CSS**: Use utility classes for all styling. Avoid custom raw CSS where possible.
* **Atomic Design**: Build reusable UI primitives in `components/ui/` (e.g. `Button.tsx`, `Badge.tsx`, `Modal.tsx`) using `clsx` and `tailwind-merge` for class overrides.

### 2.5 Forms (React Hook Form & Zod)
* **Validation**: All forms must use `react-hook-form` paired with a strict `zod` validation schema.
* **Errors**: Show error indicators inline below the invalid fields immediately after blur or form submission.

### 2.6 Routing
* **Protected Routes**: Wrap views behind route guards (`ProtectedRoute`, `RoleGuard`).
* **Route Definitions**: Centrally declare routes inside `src/routes/` with object-based configurations.

### 2.7 API Integrations
* **Axios Abstraction**: Wrap Axios in a dedicated API service. Do not write raw fetch calls inside components.
* **Tenant Headers**: Inject the current tenant identifier (`X-Tenant-ID`) into all outgoing headers.

### 2.8 Loading & Error Handling
* **Loading States**: Provide skeleton loaders or micro-animations during transitions. Avoid blocky full-screen loading masks unless bootstrapping the app.
* **Error States**: Handle API errors gracefully. Display user-friendly error banners or toast alerts, and log technical details to the console.

---

## 3. UI Design System

### 3.1 Design Philosophy & Spacing
* **Theme**: Modern, dark-mode first configuration. Clean layouts optimized for fast desktop Point of Sale (POS) operations.
* **Spacing**: Follow an 8-pixel spacing system (standard Tailwind margins/padding: `p-2` = 8px, `p-4` = 16px, `p-6` = 24px).
* **Grid**: 12-column layout grids for dashboards, stacking vertically on mobile viewports.

### 3.2 HSL Color Palette (CSS Variables)
Use CSS variables mapped to HSL values for seamless theme switching:
```css
:root {
  /* Light Theme */
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 220 14% 16%;
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;
  --secondary-foreground: 220.9 39.3% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  --border: 220 13% 91%;
  --radius: 0.5rem;
}

.dark {
  /* Dark Theme */
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  --primary: 210 20% 98%;
  --primary-foreground: 220.9 39.3% 11%;
  --secondary: 215 27.9% 16.9%;
  --secondary-foreground: 210 20% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 20% 98%;
  --border: 215 27.9% 16.9%;
}
```

### 3.3 Typography
* Use the **Inter** sans-serif font family to optimize legibility and tabular numerical alignment.
* Apply Tailwind's `tabular-nums` class on tables and numerical fields.
* **Scales**: Page titles at `text-3xl` (36px), headers at `text-2xl` (30px), body text at `text-base` (16px), and tables/labels at `text-sm` (14px).

### 3.4 UI Primitives
* **Buttons**: Clean borders, minimal hover transition delays (`transition-colors duration-200`), and explicit opacity settings for disabled states (`disabled:opacity-50`).
* **Forms**: Always place form labels above fields, and display error texts below input elements.
* **Tables**: Use light-grey headers (`bg-muted/50 text-xs font-semibold`) and thin boundaries between rows.

### 3.5 Accessibility (a11y)
* Maintain a minimum contrast ratio of 4.5:1 for text (satisfying WCAG AA criteria).
* Enforce semantic HTML elements (`<main>`, `<nav>`, `<header>`). Use `aria-hidden="true"` on non-interactive decorative icons.

---

## 4. Backend Rules (NestJS & Prisma)

### 4.1 Controllers
* **Responsibilities**: Route incoming HTTP requests, validate request bodies via DTOs, and map return values. Do not write business logic inside controllers.
* **Status Codes**: Return standard REST status codes (e.g., `201 Created` for creations, `204 No Content` for successful deletes).

### 4.2 Services
* **Core Logic**: Contain all core business logic and transactional calculations. Inject Prisma for database access.
* **Isolation**: Keep services decoupled from controllers and HTTP context.

### 4.3 Data Transfer Objects (DTOs)
* **Validation**: Decorate DTOs with `class-validator` rules.
* **Transformation**: Use `class-transformer` for type coercion (e.g., converting incoming strings to integers).

### 4.4 Modules
* **Cohesion**: Organize modules by features. Export only services that are intended to be consumed by other modules.

### 4.5 Infrastructure
* **Prisma ORM**: All database interactions must use the Prisma Client.
* **Redis**: Used as a fast caching layer and BullMQ backend.
* **BullMQ**: Queue background jobs (e.g., email notifications, heavy exports) to keep HTTP requests fast.

### 4.6 Pipes, Guards, and Filters
* **Validation Pipe**: Use a global `ValidationPipe` with `transform: true` and `whitelist: true`.
* **Tenant Guard**: Ensure all tenant-scoped routes are validated against the request context's active tenant ID.
* **Exception Filter**: Use a global Exception Filter to capture database (Prisma) and system errors, returning them in a standardized JSON error format.

---

## 5. Database Rules (PostgreSQL & Prisma)

### 5.1 Schema Conventions
* **Naming**: Use camelCase for schema model names, matching Prisma's standard, but map them to snake_case table names in the database using `@@map("table_name")`.
* **UUIDs**: All primary keys must use UUID v4.

### 5.2 Data Consistency
* **Foreign Keys**: Enforce foreign keys at the database level for all relationships.
* **Indexes**: Add database indexes on foreign keys and frequently queried fields (e.g., `tenantId`, `sku`, `email`).
* **Transactions**: Use Prisma's `$transaction` utility when modifying multiple related models to prevent partial data writes.

### 5.3 Soft Deletion
* **Rule**: Do not hard-delete transactional data. Add a `deletedAt` datetime column, and filter out deleted records in active queries.

### 5.4 Tenant Isolation
* **Isolation**: All tenant-scoped models must have a non-nullable `tenantId` field. Ensure this field is automatically applied in all SELECT, UPDATE, and DELETE operations.

---

## 6. API Rules

### 6.1 Response Structure
All responses must return a standardized JSON envelope:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 6.2 Query Parameters
* **Pagination**: Use standard query keys: `page` and `limit`.
* **Sorting**: Format sort rules as `sortBy=fieldName:ASC` or `sortBy=fieldName:DESC`.
* **Filtering**: Map filters directly to query parameters (e.g., `status=ACTIVE`).

### 6.3 Versioning
* All API endpoints must be prefixed with version markers: `/api/v1/...`.

---

## 7. Security Rules

* **Access Token**: Short-lived (15 minutes). Exchanged via standard header payloads.
* **Refresh Token**: Long-lived (7 days). Saved in a secure `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
* **Passwords**: Hash passwords using `Argon2id` or `bcrypt` with a minimum of 10 rounds before saving them to the database.
* **Rate Limiting**: Apply throttlers to login and registration endpoints to prevent brute-force attacks.
* **RBAC**: Apply role check guards to controllers to prevent unauthorized endpoint access.

---

## 8. Git & Development Conventions

### 8.1 Branch Naming
Use the following format for git branches:
* `feature/<feature-name>` - for new features
* `bugfix/<bug-description>` - for fixing bugs
* `hotfix/<critical-bug-description>` - for immediate production fixes
* `chore/<task-name>` - for dependency upgrades or build configurations

### 8.2 Commit Message Format
Commit messages must follow the Conventional Commits specification:
```
<type>(<scope>): <short-description>
```
* **Types**: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`.

### 8.3 Pull Request Checklist
Before merging, a PR must meet these criteria:
* TypeScript compiles without errors.
* No console logs remain in production paths.
* Local unit tests pass.
* The branch is updated with the target branch.

### 8.4 IDE Pre-commit Hooks (Husky)
A local pre-commit hook enforces formatting and compilation rules before commits are processed:
```bash
# Husky pre-commit script
npm run lint
npm run build
```
Any linting or compiler error aborts the commit action immediately.

---

## 9. Directory & File Naming Conventions

* **Folders**: Use kebab-case for all folders across the workspace. Do not use camelCase or snake_case for directories.
* **React Components**: PascalCase (e.g., `InvoiceReceipt.tsx`).
* **Styles & Hooks**: camelCase (e.g., `useInvoiceDetails.ts`).
* **NestJS Classes**: PascalCase with type suffix (e.g., `ProductController`, `CreateProductDto`).
* **Interfaces & Types**: PascalCase, prefixed with `I` for interfaces only if specified (prefer plain PascalCase e.g. `ProductPayload`).

---

## 10. Dependency Management Rules

### 10.1 Package Installation Process
> [!CRITICAL]
> **NO AUTOMATIC INSTALLATIONS**: You are strictly prohibited from installing packages automatically or running install scripts yourself.

To add or update a dependency:
1. Explain **why** the package is required and what module it serves.
2. Present the **exact installation command** (e.g., `npm install @tanstack/react-query`).
3. **Stop executing commands** immediately.
4. **Wait** for explicit confirmation from the user that the package has been successfully installed manually.
