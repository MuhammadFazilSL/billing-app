# Development Roadmap

This document outlines the phased sprints to develop the Multi-Tenant SaaS Billing & Shop Management System from scratch to production readiness.

All phases follow the requirements established in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Project Phasing Overview

The roadmap is divided into 7 distinct sprints. Each sprint has specific, testable goals and can be independently validated before proceeding.

```
[Sprint 1: Architecture] ──► [Sprint 2: Auth & Tenant] ──► [Sprint 3: Catalog & CRM]
                                                                     │
                                                                     ▼
[Sprint 6: Platform Admin] ◄── [Sprint 5: Checkout & POS] ◄── [Sprint 4: Inventory Log]
           │
           ▼
[Sprint 7: Production Release]
```

---

## 2. Sprint Detailed Specifications

### Sprint 1: Project Initialization & Schema Validation
* **Goal**: Establish the repository workspaces, build configs, docker layers, and database structure.
* **Features**:
  * Set up the monorepo workspace containing `frontend/` and `backend/` sub-directories.
  * Initialize the Prisma schema structure mapping PostgreSQL relationships.
  * Configure environment verification scripts.
* **Estimated Complexity**: 3 Story Points
* **Testing Checklist**:
  * Run Prisma validations: `npx prisma validate`
  * Run server builds: `npm run build` on both frontend and backend directories.
* **Definition of Done (DoD)**: Database schema connects successfully to a local Postgres instance, and clean project boilerplate builds compile without errors.

---

### Sprint 2: Multi-Tenant Authentication & Core Settings
* **Goal**: Implement tenant onboarding registration, RBAC permissions, and JWT token rotation.
* **Features**:
  * Implement local login & register logic creating default roles.
  * Setup token encryption routines and refresh token cookie handlers.
  * Add the `TenantScopingInterceptor` to scope all database reads/writes by Tenant ID.
* **Dependencies**: Sprint 1 completed.
* **Estimated Complexity**: 5 Story Points
* **Testing Checklist**:
  * Verify token refresh operations under simulated expirations.
  * Verify that Tenant A cannot read or write data belonging to Tenant B.
* **Definition of Done (DoD)**: Secure endpoints block unauthenticated requests and correctly reject users lacking appropriate permissions (RBAC).

---

### Sprint 3: Product Catalog & CRM Management
* **Goal**: Enable product catalog editing, barcode inputs, and customer profile history logs.
* **Features**:
  * Build product CRUD endpoints and file import helpers.
  * Add category and brand lookups.
  * Build customer profile directories and outstanding debt registers.
* **Dependencies**: Sprint 2 completed.
* **Estimated Complexity**: 5 Story Points
* **Testing Checklist**:
  * Import CSV product lists containing unique SKU constraints.
  * Validate that product selling prices are greater than or equal to purchase costs.
* **Definition of Done (DoD)**: Product catalogs and customer directories are fully manageable via the UI, supporting sorting, pagination, and search queries.

---

### Sprint 4: Inventory Transaction Ledger
* **Goal**: Build the transactional stock tracking system with low-stock alerts.
* **Features**:
  * Create the `InventoryTransaction` module.
  * Build database transactions that update product stock levels when inventory transactions are logged.
  * Set up notifications for items that fall below their alert thresholds.
* **Dependencies**: Sprint 3 completed.
* **Estimated Complexity**: 5 Story Points
* **Testing Checklist**:
  * Run concurrent stock adjustment queries to ensure thread-safety and row-locking logic.
  * Verify that inventory transaction rows cannot be deleted or updated.
* **Definition of Done (DoD)**: All stock adjustments are backed by immutable transaction logs, and low-stock notifications trigger immediately when stock levels drop.

---

### Sprint 5: POS Checkout & Thermal Printing
* **Goal**: Build the checkout layout, discount rules, payment processors, and receipt drivers.
* **Features**:
  * Design a fast POS checkout layout optimized for desktop viewports.
  * Implement dynamic pricing calculations handling customer credits and sales taxes.
  * Implement USB thermal receipt printing via WebUSB/ESC-POS commands.
* **Dependencies**: Sprint 4 completed.
* **Estimated Complexity**: 8 Story Points
* **Testing Checklist**:
  * Run split payment transactions matching overall invoice totals.
  * Test thermal layout compilation using mock printer outputs.
* **Definition of Done (DoD)**: Completed transactions generate clean invoices and decrement product stock levels accordingly.

---

### Sprint 6: SaaS Platform Admin Panel
* **Goal**: Build tenant analytics tracking and Stripe subscription checkouts.
* **Features**:
  * Create billing tier structures (`Plan` tables).
  * Build the master admin dashboard to manage active tenants.
  * Configure webhook handlers to process plan payments.
* **Dependencies**: Sprint 5 completed.
* **Estimated Complexity**: 8 Story Points
* **Testing Checklist**:
  * Mock Stripe webhook events and verify tenant plan expiry dates updates.
  * Verify that master admin endpoints reject standard tenant user tokens.
* **Definition of Done (DoD)**: Tenants are redirected to Stripe checkouts when upgrading plans, and payment updates are processed successfully.

---

### Sprint 7: Release & Deployments
* **Goal**: Build CI/CD release cycles, setup Cloudflare firewalls, and release production targets.
* **Features**:
  * Write GitHub Action compilation workflows.
  * Configure Vercel and Railway production settings.
  * Configure Nginx reverse proxies, SSL certificates, and security configurations.
* **Dependencies**: Sprint 6 completed.
* **Estimated Complexity**: 5 Story Points
* **Testing Checklist**:
  * Run automated security scanners (e.g. OWASP ZAP) against staging endpoints.
  * Run backend performance test cases under simulated checkout loads.
* **Definition of Done (DoD)**: Live staging environments build and deploy automatically on git main pushes, and all system tests pass.
