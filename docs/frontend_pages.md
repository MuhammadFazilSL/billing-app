# Frontend Pages Specification

This document specifies the user interface screens, layout structures, API dependencies, Redux store slices, and page-specific business rules for the React client.

All page designs are cross-referenced with the **[Architecture Blueprint](file:///d:/personal/billing-saas/docs/architecture_blueprint.md)**.

---

## 1. Authentication & Onboarding

### 1.1 Login Screen (`/auth/login`)
* **Purpose**: Authenticates credentials and boots the user's active session.
* **Component Structure**:
  * `LoginCard`: Card container.
  * `LoginForm`: Form handling inputs (email, password) and showing validator errors.
* **API Dependencies**:
  * `POST /api/v1/auth/login` (Mutation)
* **State Management**:
  * Redux: Dispatches `setCredentials` to save token payload and user profiles in `authSlice`.
* **Business & Validation Rules**:
  * Checks inputs via Zod schema (non-empty fields, valid email format).
  * Automatically redirects to `/app/dashboard` if valid JWT access tokens exist.
* **Responsive Layout**: Single column layout centered on all breakpoints.

---

### 1.2 Registration Screen (`/auth/register`)
* **Purpose**: Registers new tenant organizations and creates the owner account.
* **Component Structure**:
  * `RegisterMultiStepForm`: Form dividing tenant metadata and user credential inputs.
* **API Dependencies**:
  * `POST /api/v1/auth/register` (Mutation)
* **Business & Validation Rules**:
  * Real-time verification of slug uniqueness (`/api/v1/tenants/check-slug?slug=value`).
  * Enforces password guidelines (minimum 8 characters, numbers, and symbols).

---

## 2. Main Application Workspace

### 2.1 Sales Point of Sale Dashboard (`/app/billing`)
* **Purpose**: Real-time checkout window supporting scanner integrations, dynamic carts, and custom payment splits.
* **Component Structure**:
  * `POSLayout`: Split screen (Grid left: catalog grid/product selector, Sidebar right: invoice shopping cart).
  * `BarcodeScannerInput`: Hidden listener capturing serial barcode scanner events.
  * `CartList`: Line item cards with dynamic counters.
  * `CheckoutPaymentModal`: Controls payment splits (Cash/Card/UPI), credits, and discount modifiers.
* **API Dependencies**:
  * `GET /api/v1/products?search=` (Query)
  * `POST /api/v1/invoices` (Mutation)
* **State Management**:
  * Redux `cartSlice`: Manages active cart items, active customer selection, and pending payment distributions.
* **POS Business Rules**:
  * Dynamic tax calculations run on the client using a decimal library (preventing IEEE 754 float errors).
  * Items are automatically added when barcode matches are detected.
  * Submitting the cart locks the page and prints receipts directly.
* **Responsive Layout**: Full-screen layout. Grids stack vertically on mobile screens.

---

### 2.2 Product Catalog Manager (`/app/products`)
* **Purpose**: Displays inventory, controls pricing models, and manages barcodes.
* **Component Structure**:
  * `ProductTable`: TanStack Table listing catalog items with paging, sorting, and inline search.
  * `ProductFormModal`: Floating dialog for creating and updating product details.
  * `ImportCsvModal`: Dialog for uploading product lists in CSV format.
* **API Dependencies**:
  * `GET /api/v1/products` (Query - Cached using TanStack Query)
  * `POST /api/v1/products` (Mutation)
  * `PUT /api/v1/products/:id` (Mutation)
* **State Management**:
  * TanStack Query: Caches product lists. Invalidates cache on creation or update mutations.

---

### 2.3 CRM Portal (`/app/customers`)
* **Purpose**: Profiles store customers, tracks credit sales, and details outstanding balances.
* **Component Structure**:
  * `CustomerList`: Customer search panel and table.
  * `CustomerLedgerDetail`: Timeline showing historic purchases, returns, and payment credits.
* **API Dependencies**:
  * `GET /api/v1/customers` (Query)
  * `GET /api/v1/customers/:id/ledger` (Query)
  * `POST /api/v1/customers` (Mutation)

---

### 2.4 Reporting & Analytics Hub (`/app/reports`)
* **Purpose**: Visualizes financial trends, product sales, tax structures, and business reports.
* **Component Structure**:
  * `ReportOverviewCards`: Metric cards (Gross Sales, Net Profit, Taxes Owed).
  * `SalesTrendsChart`: Recharts line/area charts visualizing performance.
  * `ExportButton`: Initiates CSV/PDF background compilation tasks via BullMQ.
* **API Dependencies**:
  * `GET /api/v1/reports/summary` (Query - Cached for 15 minutes)
  * `POST /api/v1/reports/export` (Mutation)

---

## 3. Platform Administration Workspace

### 3.1 Master Tenant Control Center (`/master-admin/tenants`)
* **Purpose**: Admin dashboard for monitoring tenants, reviewing platform metrics, and managing subscriptions.
* **Component Structure**:
  * `TenantListTable`: Table of registered tenants showing active plans, user counts, and statuses.
  * `GlobalMetricsGrid`: High-level SaaS metrics cards (MRR, active tenants, API load counters).
* **API Dependencies**:
  * `GET /api/v1/master-admin/tenants` (Query)
  * `PATCH /api/v1/master-admin/tenants/:id/status` (Mutation)
* **State Management**:
  * Guard checks verify `isMasterAdmin` flags in token structures before loading route assets.
