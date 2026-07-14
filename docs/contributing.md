# Contributing Guidelines

This document outlines the workflows, pull request processes, code review checklists, and environment setup guidelines for contributing to the SaaS Billing & Shop Management System.

All procedures adhere to the requirements defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Local Environment Setup

To set up the development environment, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-org/billing-saas.git
   cd billing-saas
   ```
2. **Install Dependencies**:
   > [!CRITICAL]
   > **Package Rule Compliance**: Never add packages manually. Request review if new dependencies are needed, then run the installation commands.
   ```bash
   # Run in root directory to install workspaces
   npm install
   ```
3. **Database Spin-up**:
   Configure local variables in the `.env` file and generate the database schema mapping:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. **Boot Development Engines**:
   Run both workspaces locally:
   * Backend: `cd backend && npm run start:dev` (starts on port 3000)
   * Frontend: `cd frontend && npm run dev` (starts on port 5173)

---

## 2. Git Branching & Workflow

We use a feature branching workflow (based on GitHub Flow):

```
main [Production] ──► Create branch feature/pos-discounts ──► PR Review ──► Squash & Merge to main
```

1. **Create Branch**: Always branch off the latest `main` branch. Use the naming convention defined in the coding standards (e.g. `feature/pos-split-payment`).
2. **Develop**: Keep changes focused on a single feature or bug fix. Commit frequently with clear messages.
3. **Pull Request**: Open a PR targeting `main`. Complete the PR template checklist before requesting review.

---

## 3. Pull Request (PR) Checklist

Ensure your PR satisfies the following conditions before requesting review:

- [ ] All code conforms to the **[Coding Standards](file:///d:/personal/billing-saas/docs/coding_standards.md)**.
- [ ] No new third-party dependencies are introduced without approval.
- [ ] All local tests pass (`npm run test` on both workspaces).
- [ ] Frontend builds successfully without TypeScript or linter errors.
- [ ] Backend migrations are added for schema modifications.
- [ ] Outgoing requests include the required `X-Tenant-ID` headers.

---

## 4. Code Review Guidelines

Reviewers look for these specific patterns during reviews:

* **Tenant Isolation Security**: Confirm that endpoints scope queries using the request's `tenantId`. Reject any PR containing direct queries without tenant checks.
* **Component Size Limits**: Confirm that React components do not exceed the 300-line limit.
* **Immutable Ledgers**: Verify that database changes in the `InventoryTransaction` or `Invoice` modules are append-only.
* **API Standardization**: Ensure response shapes match the uniform response envelopes.
