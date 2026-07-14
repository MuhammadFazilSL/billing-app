# Coding Standards & Guidelines

This document provides coding style parameters, naming conventions, typescript guidelines, and formatting rules for all developers working on the SaaS Billing & Shop Management System.

All guidelines correspond to the requirements defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Naming Conventions

### 1.1 Folder Naming
* Use kebab-case for all folders across the workspace. Do not use camelCase or snake_case for directories:
  * Good: `features/billing-pos/`
  * Bad: `features/billingPos/`, `features/billing_pos/`

### 1.2 File Naming
* **React Components**: Use PascalCase (e.g. `InvoiceReceipt.tsx`, `ProductFormModal.tsx`).
* **Standard TypeScript Files**: Use camelCase (e.g. `authGuard.ts`, `axiosInstance.ts`).
* **NestJS Components**: Match standard CLI naming patterns: `<name>.<type>.ts`
  * Controllers: `product.controller.ts`
  * Services: `product.service.ts`
  * DTOs: `create-product.dto.ts`
  * Modules: `product.module.ts`

### 1.3 Code Elements
* **Variables & Functions**: Use camelCase (e.g. `const invoiceTotal = 100;`).
* **Classes & Structs**: Use PascalCase (e.g. `class BillingService {}`).
* **Interfaces & Types**: Use PascalCase (e.g. `type InvoiceStatus = 'PAID' | 'UNPAID';`).
* **Enums**: Use UPPERCASE for keys (e.g. `enum PaymentMethod { CASH = 'CASH', CARD = 'CARD' }`).

---

## 2. TypeScript Guidelines
* **Strict Mode**: Enable strict checks (`"strict": true` in `tsconfig.json`).
* **No Explicit `any` Types**: Do not use the `any` type. If a type is unknown, use `unknown` and apply runtime checks.
* **Avoid Non-Null Assertions**: Avoid using non-null assertions (`!`). Use explicit checks or logical fallback handlers instead.
* **Explicit Return Types**: All functions and class methods must define explicit return types to improve readability.
  ```typescript
  // Good
  function computeDiscount(price: number): number {
    return price * 0.10;
  }
  
  // Bad
  function computeDiscount(price: number) {
    return price * 0.10;
  }
  ```

---

## 3. Formatting & Style Rules (ESLint & Prettier)
Code must be formatted using Prettier. Configure settings inside the project root:

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

* **No Console Logs**: Do not merge code containing debug outputs (`console.log`). Use NestJS's `Logger` or custom logging services on the backend instead.

---

## 4. Git Workflows & Commit Guidelines
We use the Conventional Commits specification to standardise commits:

```
<type>(<scope>): <subject>
```

### 4.1 Commit Types
* `feat`: A new user-facing feature.
* `fix`: A bug fix.
* `refactor`: REST API or structural changes that do not modify feature behavior.
* `docs`: Documentation updates.
* `test`: Adding or updating test cases.
* `chore`: Build configurations or dependency updates.

### 4.2 Commit Example
```
feat(billing): add thermal printing functionality for ESC/POS receipt formats
```
---

## 5. IDE Pre-commit Hooks (Husky)
A local pre-commit hook enforces formatting and compilation rules before commits are processed:

```bash
# Husky pre-commit script
npm run lint
npm run build
```
Any linting or compiler error aborts the commit action immediately.
