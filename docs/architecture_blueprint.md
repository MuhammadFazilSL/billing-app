# Architecture Blueprint: Multi-Tenant SaaS Billing & Shop Management System

This document outlines the architectural blueprint, system design, and database schema for a production-quality, multi-tenant SaaS Billing & Shop Management System.

---

## 1. High-Level System Architecture

The system utilizes a modern, cloud-native **Logical Multi-Tenancy** architecture with a single shared database. Data isolation is enforced at the software layer via a required `tenantId` field on all tenant-scoped tables.

```mermaid
graph TD
    Client[React Frontend - Vercel / Cloudflare CDN]
    CDN[Cloudflare DNS & WAF]
    LB[Nginx Reverse Proxy & Load Balancer]
    API[NestJS API Cluster - Railway / VPS / Docker]
    DB[(Supabase PostgreSQL Database)]
    Redis[(Redis - Caching & BullMQ Queue)]
    Storage[Supabase Object Storage]
    EmailService[Brevo Email SMTP/API]

    Client -->|HTTPS / WAF| CDN
    CDN --> LB
    LB -->|Load Balancing| API
    API -->|ORM Transactions| DB
    API -->|Queuing & Caching| Redis
    API -->|S3 API / Uploads| Storage
    API -->|Transactional Emails| EmailService
```

### 1.1 Request Flow
1. **DNS & Security Layer**: The client request passes through Cloudflare (handling SSL termination, DDoS protection, and rate limiting).
2. **Reverse Proxy**: Nginx forwards the traffic to the NestJS cluster, injecting the correct client IP and request tracing headers.
3. **Guard & Interceptor (Auth & Tenant Context)**:
   - NestJS Guards authenticate the request using the Authorization header (JWT).
   - A global interceptor/middleware extracts the tenant identifier (`X-Tenant-ID` header or JWT payload) and attaches it to the request context.
4. **Service Layer**: Business logic executes.
5. **Data Layer**: Prisma executes a query containing the `tenantId` scope filter.
6. **Response Interceptor**: Formats the API response into a standardized JSON envelope.

### 1.2 Authentication Flow (JWT with Refresh Token Rotation)

```mermaid
sequenceDiagram
    autonumber
    actor User as Client App
    participant API as NestJS Auth Module
    participant DB as PostgreSQL DB
    participant Cache as Redis (Token Blacklist)

    User->>API: POST /api/v1/auth/login {email, password, tenantId}
    API->>DB: Query User & Tenant (verify credentials & status)
    DB-->>API: User Record & Role/Permissions
    API->>API: Generate Access Token (15m) & Refresh Token (7d)
    API->>Cache: Save Refresh Token Metadata (jti)
    Note over API: Access Token in JSON response body.<br/>Refresh Token in Secure, HttpOnly, SameSite=Strict cookie.
    API-->>User: HTTP 200 { accessToken, userProfile }

    Note over User, API: Subsequent authenticated requests
    User->>API: GET /api/v1/products (Header: Bearer <AccessToken>)
    API-->>User: 200 OK (Data)

    Note over User, API: Access Token Expires (401 Unauthorized)
    User->>API: POST /api/v1/auth/refresh (Sends Refresh Cookie)
    API->>Cache: Verify Refresh Token jti (Check if blacklisted or active)
    API->>DB: Check User & Tenant Status
    API->>API: Generate New Access Token & Rotate Refresh Token
    API->>Cache: Blacklist old Refresh Token (jti) & Save new jti
    API-->>User: HTTP 200 { accessToken }
```

### 1.3 Billing Flow (Real-Time checkout to PDF & Thermal Receipt)

```mermaid
flowchart TD
    Start([1. Start Invoice Checkout]) --> ScanCode[2. Scan Barcode / Search Product]
    ScanCode --> CheckInventory{3. Check Stock & Multi-tax}
    CheckInventory -- In Stock --> AddCart[4. Add Item to Cart & Calculate Totals]
    CheckInventory -- Out of Stock --> Alert[Show Stock Error / Backorder Alert]
    AddCart --> CartLoop{5. More Items?}
    CartLoop -- Yes --> ScanCode
    CartLoop -- No --> PaymentMethod{6. Select Payment Method}
    
    PaymentMethod -- Cash/Card/UPI --> RecPay[7. Record Payment Transaction]
    PaymentMethod -- Credit/Split --> Ledger[7. Create Customer Ledger Entry & Record Split Details]

    RecPay & Ledger --> CompleteInvoice[8. Save Invoice & Generate Code/QR]
    CompleteInvoice --> QueueJobs[9. Dispatch BullMQ background jobs]
    
    subgraph BullMQ Jobs
        Job1[Generate PDF Invoice]
        Job2[Update Inventory Transaction Log]
        Job3[Send Email Receipt]
    end
    
    QueueJobs --> Job1 & Job2 & Job3
    CompleteInvoice --> OutputInvoice{10. Output Selection}
    OutputInvoice --> PrintThermal[11. Send RAW text to Thermal Printer ESC/POS]
    OutputInvoice --> OpenPDF[11. Display PDF Invoice for Download]
```

### 1.4 Inventory Flow

```mermaid
flowchart TD
    Action[Inventory Action: Sale, Purchase, Adjustment, Damage] --> RecordTx[1. Create InventoryTransaction Record]
    RecordTx --> UpdateAgg[2. Transaction triggers db transaction/lock on Product]
    UpdateAgg --> Recalculate[3. Increment/Decrement Product.stock]
    Recalculate --> AuditTrail[4. Record Activity Log entry]
    AuditTrail --> ThresholdCheck{5. Product.stock <= Product.alertThreshold?}
    ThresholdCheck -- Yes --> Notify[6. Trigger Low Stock Notification]
    ThresholdCheck -- No --> End([Done])
```

### 1.5 Payment Flow (SaaS Subscription)

```mermaid
sequenceDiagram
    actor Tenant as Tenant Admin
    participant App as React App
    participant API as NestJS Billing Module
    participant Gateway as Stripe / Razorpay API
    participant Webhook as NestJS Webhook Handler
    participant DB as PostgreSQL DB

    Tenant->>App: Choose Plan (Monthly/Annual)
    App->>API: POST /api/v1/subscriptions/checkout { planId }
    API->>Gateway: Create Checkout Session (Customer & Subscription meta)
    Gateway-->>API: Checkout Session URL & ID
    API-->>App: Return checkout url
    App->>Tenant: Redirect to Gateway Hosted checkout page
    Tenant->>Gateway: Enter Payment Info & Pay
    Gateway-->>Tenant: Redirect to App (Success URL)
    
    Note over Gateway, Webhook: Async Webhook Execution
    Gateway->>Webhook: POST /api/v1/webhooks/stripe (Event: checkout.session.completed)
    Webhook->>Webhook: Validate Webhook Signature
    Webhook->>DB: Update Tenant Subscription (status = ACTIVE, plan, renewalDate)
    Webhook->>DB: Create SubscriptionTransaction record for billing history
    Webhook-->>Gateway: HTTP 200 OK
```

### 1.6 Deployment Flow (GitOps Pipeline)

```mermaid
graph LR
    Dev[Developer git push] --> GH[GitHub Repository]
    GH -->|Triggers CI/CD| Actions[GitHub Actions]
    
    subgraph Frontend Build
        Actions -->|Lint/Test| BuildFE[Vite Production Build]
        BuildFE -->|Deploy| Vercel[Vercel Global CDN]
    end
    
    subgraph Backend Build
        Actions -->|Lint/Test| BuildBE[Dockerize Application]
        BuildBE -->|Push Image| Registry[GHCR / Docker Hub]
        Registry -->|Deploy Webhook| Railway[Railway / VPS Engine]
        Railway -->|Run Prisma Migrations| Migrations[PostgreSQL DB Sync]
    end
```

---

## 2. Folder Structure

We use a modular, feature-based architecture for both the Frontend and Backend. This groups files by business feature rather than technical file types, improving code discoverability and preventing file sprawl.

### 2.1 Backend Folder Structure

We organize the backend using standard NestJS modular patterns:

```
backend/
├── prisma/                    # Prisma configuration and database management
│   ├── schema.prisma          # Shared database schema configuration
│   ├── seed.ts                # Master DB seeding script
│   └── migrations/            # SQL migrations generated by Prisma
├── src/
│   ├── main.ts                # Application bootstrapped configuration
│   ├── app.module.ts          # Root module orchestrator
│   ├── common/                # Shared utilities, decorators, guards, filters
│   │   ├── decorators/        # Custom NestJS decorators (e.g., @GetTenant, @Roles)
│   │   ├── dto/               # Global standard DTOs (e.g., PaginationQueryDto)
│   │   ├── filters/           # Global Exception Filters (e.g., PrismaExceptionFilter)
│   │   ├── guards/            # Authentication, RBAC, and Tenant scoping guards
│   │   ├── interceptors/      # Response transformation and performance logging
│   │   ├── middleware/        # Request parsing and security middleware
│   │   └── utils/             # Helper libraries
│   ├── config/                # Environment variables parsing & validation (Zod config)
│   ├── modules/               # Domain-driven feature modules
│   │   ├── auth/              # JWT, Passport Strategies, Refresh Session
│   │   ├── tenant/            # Tenant creation, settings, multi-store metadata
│   │   ├── users/             # User profiles, employee records, roles
│   │   ├── products/          # Inventory items, brands, categories
│   │   ├── inventory/         # InventoryTransactions, stock movements
│   │   ├── billing/           # Checkout invoices, invoice items, POS cash sessions
│   │   ├── customers/         # Customer profiles, balances, ledgers
│   │   ├── suppliers/         # Supplier management, purchasing invoices
│   │   ├── purchases/         # Goods receiving, supplier invoices
│   │   ├── expenses/          # Store expense ledger
│   │   ├── offers/            # Discounts, coupon engines, loyalty parameters
│   │   ├── reports/           # Financial aggregations, tax summaries, CSV generation
│   │   ├── notifications/     # In-app alerts, BullMQ job dispatchers
│   │   ├── subscriptions/     # SaaS billing packages, Stripe integration, tenant limits
│   │   └── master-admin/      # Platform-wide tenant management and global metrics
│   └── providers/             # Infrastructure integrations (Redis, BullMQ, Brevo, S3)
```

**Why this backend structure?**
* **Scalability**: By placing all code related to a domain model (e.g., `products`) under its module folder, we can easily export it or refactor it into an isolated microservice in the future.
* **Separation of Concerns**: Global infrastructure and framework components reside in `common/` and `providers/`, isolating domain code from technical middleware.

### 2.2 Frontend Folder Structure

```
frontend/
├── public/                    # Standard static assets
├── src/
│   ├── main.tsx               # Client bootstrap configuration
│   ├── App.tsx                # Base routing wrapper & provider chain
│   ├── index.css              # Global Tailwind configuration & typography rules
│   ├── assets/                # Local graphic assets, logos, and UI vectors
│   ├── components/            # Shared, domain-agnostic presentation components
│   │   ├── ui/                # Core atomic UI primitives (Buttons, Inputs, Modals, Badges)
│   │   ├── tables/            # Reusable TanStack Table wrappers (sorting, paging components)
│   │   ├── forms/             # Shared form layouts, form wrappers, feedback elements
│   │   └── charts/            # Reusable Recharts templates
│   ├── features/              # Feature-based architecture
│   │   ├── auth/              # Registration, Login, ForgotPassword pages/components
│   │   ├── dashboard/         # Tenant dashboard analytics components
│   │   ├── products/          # Product lists, stock trackers, barcodes
│   │   ├── billing/           # Dynamic POS checkout interface
│   │   ├── customers/         # Customer profiles and purchase history
│   │   ├── subscriptions/     # Plan upgrades, billing details, Stripe redirect status
│   │   └── admin/             # Master SaaS portal pages (restricted to global admins)
│   │       ├── components/    # Feature-scoped components
│   │       ├── hooks/         # Custom React queries or local state logic
│   │       ├── services/      # Axios API request abstractions
│   │       ├── store/         # Redux Toolkit sub-slices if needed
│   │       └── types/         # Feature-specific TypeScript interfaces
│   ├── hooks/                 # Global UI hooks (useAuth, useTheme, useDebounce)
│   ├── routes/                # Central routing table (public, private, tenant-admin, master-admin)
│   ├── store/                 # Central Redux Toolkit configuration & global slices
│   │   ├── index.ts           # Store orchestrator
│   │   └── slices/            # Global state slices (e.g., uiSlice, cartSlice)
│   └── utils/                 # General helpers (formatters, mathematical helpers, POS drivers)
```

**Why this frontend structure?**
* **Colocation of Feature Logic**: Developers can find styles, state hooks, queries, and views for the POS billing screen in `features/billing/` without traversing distinct root-level directories.
* **Reusable Primitives**: Reusable, pure components are explicitly separated in `components/ui/`, simplifying consistency across screens.

---

## 3. Module Breakdown

| Module | Purpose | Core Responsibilities | Key Dependencies | Future Scalability |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | User identity & authentication | Tokens generation, Refresh, RBAC enforcement | Passport, JWT | Support Single Sign-On (SSO), OAuth2, Biometrics |
| **Tenant** | Business account context | Business meta-profile, subscription allocation | Subscriptions | Support multi-branch organization configuration |
| **Employees** | Sub-user staff accounts | Employee profiles, shifts, system activity | Auth, Tenant | Timesheets, HR, payroll processing modules |
| **Products** | Inventory catalogs | Product profiles, SKU, pricing rules, taxes | Tenant | Multi-language descriptions, bulk CSV importing |
| **Inventory** | Stock adjustments & tracking | InventoryTransaction audit log, adjustments | Products, Suppliers | AI-driven reorder alerts, warehouse management |
| **Billing** | Point-of-Sale sales | Transaction calculations, receipts, payment recording | Products, Customers | Offline checkout fallback, automated taxing API |
| **Customers** | CRM management | Contact profiles, loyalty systems, balance ledger | Tenant | Marketing campaigns, credit scores profiling |
| **Suppliers** | Vendor relations | Contact profiling, vendor ledger balances | Tenant | API integration for automatic order fulfillment |
| **Purchases** | Restocking management | Supplier invoices recording, item inventory adjustments | Suppliers, Products | Automated barcode printing upon stock arrival |
| **Expenses** | Operating cost tracing | Cost classification ledger, tax reporting | Tenant | OCR parsing of expense receipts |
| **Offers** | Customer conversion | Promotional code rules, discount criteria | Customers | Dynamic AI recommendation engines for checkout |
| **Reports** | Analytics dashboards | High-performance aggregate calculation, export pipelines | All data modules | Advanced BI integrations, scheduled mail drops |
| **Notifications** | Alerts & communication | Delivery of mail, SMS, and in-app system warnings | BullMQ | SMS gateways routing optimization |
| **Subscription**| Platform monetization | Subscription lifecycle management, checkout | Tenant, Stripe API | Flexible usage-based billing pricing meters |
| **Settings** | Configuration management | Receipt configurations, thermal printing layouts | Tenant | Config versioning & rollback capability |
| **Master Admin**| Platform administration | Monitoring tenants, usage telemetry, billing audits | All modules | Fraud detection automation, platform health panels |

---

## 4. Database Design

### 4.1 Schema Modeling Strategy (Multi-Tenancy)
We will use a shared-database design using a `tenant_id` on all tenant-specific entities.
* To secure queries, a Prisma middleware or custom NestJS interceptor will automatically append `where: { tenantId }` filter conditions to queries, preventing developer errors that could lead to cross-tenant data leaks.
* Database indexes are established on all `tenantId` columns to ensure rapid lookups, as Postgres tables grow larger over time.

### 4.2 Database Tables Specification

#### 4.2.1 Core Platform Tables
These manage the overall SaaS application metadata, subscription model, and tenant boundaries.

```
Table: Plan (Subscription Tier Setup)
- id (UUID, PK)
- name (VARCHAR, Unique) - e.g., "Basic", "Pro", "Enterprise"
- price (DECIMAL)
- billingCycle (ENUM: MONTHLY, ANNUALLY)
- maxProducts (INT)
- maxEmployees (INT)
- maxInvoicesPerMonth (INT)
- features (JSONB) - Holds details like {"hasAi": true, "hasMultiBranch": false}
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

Table: Tenant (Individual Business Accounts)
- id (UUID, PK)
- name (VARCHAR)
- slug (VARCHAR, Unique) - Subdomain routing identifier (e.g., "my-shop")
- logoUrl (VARCHAR, Nullable)
- address (TEXT)
- phone (VARCHAR)
- currency (VARCHAR) - e.g., "USD", "INR"
- settings (JSONB) - Tax ID, printer templates, operating configurations
- status (ENUM: ACTIVE, SUSPENDED, DELETED)
- planId (UUID, FK -> Plan.id)
- subscriptionExpiresAt (TIMESTAMP)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [slug], [status]
```

#### 4.2.2 Users & Authentication (RBAC)
```
Table: User (Individual account logins)
- id (UUID, PK)
- email (VARCHAR, Unique)
- passwordHash (VARCHAR)
- firstName (VARCHAR)
- lastName (VARCHAR)
- phone (VARCHAR, Nullable)
- tenantId (UUID, FK -> Tenant.id, Nullable for Master Admins)
- status (ENUM: ACTIVE, INACTIVE, SUSPENDED)
- isMasterAdmin (BOOLEAN, Default: false)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [email], [tenantId]

Table: Role (Scoped positions within a Tenant)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- name (VARCHAR) - e.g., "Owner", "Store Manager", "Cashier"
- description (TEXT)
- isSystemRole (BOOLEAN, Default: false) - Cannot be deleted
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [tenantId, name]

Table: Permission (Fine-grained access rights)
- id (UUID, PK)
- code (VARCHAR, Unique) - e.g., "products:create", "billing:process"
- description (VARCHAR)

Table: RolePermission (Many-to-Many Bridge)
- roleId (UUID, FK -> Role.id, PK)
- permissionId (UUID, FK -> Permission.id, PK)

Table: UserRole (Many-to-Many Bridge)
- userId (UUID, FK -> User.id, PK)
- roleId (UUID, FK -> Role.id, PK)
```

#### 4.2.3 CRM & SRM Modules
```
Table: Customer (Client identities for invoice collection)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- name (VARCHAR)
- email (VARCHAR, Nullable)
- phone (VARCHAR, Nullable)
- address (TEXT, Nullable)
- outstandingBalance (DECIMAL, Default: 0.00) - For credit sales tracking
- loyaltyPoints (INT, Default: 0)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [tenantId, phone]

Table: Supplier (Vendors supplying raw inventory goods)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- companyName (VARCHAR)
- contactName (VARCHAR, Nullable)
- email (VARCHAR, Nullable)
- phone (VARCHAR, Nullable)
- address (TEXT, Nullable)
- outstandingBalance (DECIMAL, Default: 0.00) - Money owed to suppliers
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [tenantId]
```

#### 4.2.4 Inventory & Sales Modules
```
Table: Product (Store items catalog)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- name (VARCHAR)
- sku (VARCHAR, Nullable) - Stock Keeping Unit (Unique per tenant)
- barcode (VARCHAR, Nullable) - UPC/EAN code
- description (TEXT, Nullable)
- purchasePrice (DECIMAL) - Cost of acquisition
- sellingPrice (DECIMAL) - Base listing price
- stock (DECIMAL, Default: 0) - Current stock level
- alertThreshold (DECIMAL, Default: 5.00) - Triggers low-stock warnings
- taxRate (DECIMAL, Default: 0.00) - Standard tax percentage
- categoryId (UUID, FK -> Category.id, Nullable)
- brandId (UUID, FK -> Brand.id, Nullable)
- status (ENUM: ACTIVE, INACTIVE, ARCHIVED)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
Index: [tenantId, sku], [tenantId, barcode]

Table: InventoryTransaction (Double-Entry Stock Movements)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- productId (UUID, FK -> Product.id)
- type (ENUM: PURCHASE, SALE, RETURN_FROM_CUSTOMER, RETURN_TO_SUPPLIER, DAMAGE, MANUAL_ADJUSTMENT)
- quantity (DECIMAL) - Always positive
- direction (ENUM: IN, OUT) - Dictates inventory accumulation/depletion
- unitCost (DECIMAL) - Cost at the time of transaction
- referenceId (UUID, Nullable) - Points to InvoiceId, PurchaseId, or AdjustmentId
- userId (UUID, FK -> User.id) - Who initiated the change
- notes (TEXT, Nullable)
- createdAt (TIMESTAMP)
Index: [tenantId, productId, type]

Table: Category & Brand (Helper classification tables)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- name (VARCHAR)
- createdAt (TIMESTAMP)
```

#### 4.2.5 Transactional Billing Modules
```
Table: Invoice (Sales transactions record)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- invoiceNumber (VARCHAR) - Structured string (e.g., "INV-2026-0001") unique per tenant
- customerId (UUID, FK -> Customer.id, Nullable for Cash/Anonymous sales)
- subTotal (DECIMAL)
- discountAmount (DECIMAL, Default: 0.00)
- taxAmount (DECIMAL)
- grandTotal (DECIMAL)
- amountPaid (DECIMAL)
- balanceDue (DECIMAL)
- paymentStatus (ENUM: PAID, PARTIALLY_PAID, UNPAID, REFUNDED)
- paymentMethod (ENUM: CASH, CARD, UPI, CREDIT, SPLIT)
- userId (UUID, FK -> User.id) - Cashier who processed transaction
- notes (TEXT, Nullable)
- createdAt (TIMESTAMP)
Index: [tenantId, invoiceNumber], [tenantId, createdAt]

Table: InvoiceItem (Line items for sales invoices)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- invoiceId (UUID, FK -> Invoice.id)
- productId (UUID, FK -> Product.id)
- productName (VARCHAR) - Snapshotted name in case of future product updates
- quantity (DECIMAL)
- unitPrice (DECIMAL) - Price charged for the item
- unitCost (DECIMAL) - Cost of goods sold (COGS) for profitability metrics
- taxRate (DECIMAL)
- taxAmount (DECIMAL)
- discountAmount (DECIMAL)
- totalAmount (DECIMAL)
Index: [invoiceId]

Table: InvoicePayment (Multiple payments per invoice)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- invoiceId (UUID, FK -> Invoice.id)
- paymentMethod (ENUM: CASH, CARD, UPI, CREDIT)
- amount (DECIMAL)
- transactionReference (VARCHAR, Nullable) - External card/UPI transaction ID
- createdAt (TIMESTAMP)
```

#### 4.2.6 Audits, Alerts & System Logs
```
Table: ActivityLog (Audit trail tracking system actions)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- userId (UUID, FK -> User.id)
- action (VARCHAR) - e.g., "PRODUCT_UPDATE", "INVOICE_DELETE"
- entityName (VARCHAR) - e.g., "Product", "Invoice"
- entityId (UUID) - Target entity ID
- details (JSONB) - Before/after object snapshots
- ipAddress (VARCHAR, Nullable)
- userAgent (VARCHAR, Nullable)
- createdAt (TIMESTAMP)
Index: [tenantId, createdAt]

Table: Notification (Alert entries)
- id (UUID, PK)
- tenantId (UUID, FK -> Tenant.id)
- type (ENUM: LOW_STOCK, SUBSCRIPTION_EXPIRING, INVOICE_OVERDUE, SYSTEM_ALERT)
- title (VARCHAR)
- message (TEXT)
- isRead (BOOLEAN, Default: false)
- createdAt (TIMESTAMP)
Index: [tenantId, isRead]
```

---

## 5. Authentication & Authorization

### 5.1 Registration Flow
1. **Tenant Validation**: System checks if the tenant's chosen slug (e.g. `shopname`) is available.
2. **Atomic Creation**: Inside a database transaction:
   - Create a `Tenant` entity linked to the default `Plan` (Free trial).
   - Create the `Role` entities: "Owner" (assigns all permissions), "Manager", and "Cashier".
   - Create the `User` record with password hashing (using Argon2id or bcrypt).
   - Link the user to the "Owner" role in `UserRole`.
3. **Activation Trigger**: Dispatch an email verification job to BullMQ.

### 5.2 Login & Session Management
* **Dual-Token System**:
  - **Access Token**: Short-lived (15 minutes). Transmitted via custom JSON payload. Passed in Authorization header as `Bearer <token>`.
  - **Refresh Token**: Long-lived (7 days). Stored in a secure `HttpOnly`, `Secure`, `SameSite=Strict` cookie named `refreshtoken`. Path restricted to `/api/v1/auth/refresh`.
* **Refresh Token Rotation (RTR)**:
  - Each time a refresh token is used, a new one is issued, and the old token is marked as blacklisted in Redis.
  - If a blacklisted token is reused (indicating a potential breach), the entire token family is invalidated immediately, forcing a log out for safety.
* **Token Payload details**:
  ```json
  {
    "sub": "user_uuid_here",
    "tenantId": "tenant_uuid_here",
    "email": "user@example.com",
    "roles": ["Owner"],
    "permissions": ["products:create", "billing:process"]
  }
  ```

### 5.3 RBAC Enforcement Mechanism
1. A NestJS `RolesGuard` evaluates permission markers attached to endpoints.
2. The user's permissions array (extracted from the authenticated token) is checked.
3. If the required permission is not present, the request is rejected with a `403 Forbidden` error.

---

## 6. Frontend Architecture

### 6.1 Routing Strategy & Layouts
We use `react-router-dom` (version 6+ object routing) to structure routes.

* **Public Layout**: Accessible without logging in. Contains login, registration, and reset password.
* **Dashboard (Tenant) Layout**: Authenticated workspace. The layout features sidebar navigation, a notification header, dynamic multi-tenant branding, and workspace loaders.
* **Master Admin Layout**: Restricts access to global portal admins using a route guard.

```tsx
// Abstract Routing Pattern
export const routes = [
  {
    path: '/auth',
    element: <PublicLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> }
    ]
  },
  {
    path: '/app',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <DashboardOverview /> },
      { path: 'billing', element: <BillingPOS /> },
      { path: 'products', element: <ProductsList /> }
    ]
  },
  {
    path: '/master-admin',
    element: <MasterAdminRoute><MasterAdminLayout /></MasterAdminLayout>,
    children: [
      { path: 'tenants', element: <TenantControlCenter /> }
    ]
  }
];
```

### 6.2 UI Library Organization (Atomic Components Design)
We structure components using atomic design guidelines in Tailwind CSS:
* **Atomic Components (`components/ui`)**: Low-level, stateless, customizable primitives (e.g. `Button.tsx`, `Input.tsx`, `Modal.tsx`, `Dropdown.tsx`).
* **Composed UI Layouts**: Features that assemble primitives with React hooks (e.g. `TanStackTable.tsx`, featuring integrated filter and pagination controls).

### 6.3 State Management Blueprint
1. **Server State (TanStack Query)**: Used for data fetching, server state caching, caching indicators, pagination, and optimistic updates.
2. **Local UI State (React Context / useState)**: Used for ephemeral UI states (such as active sidebars, modal toggles, dropdown lists).
3. **Global App State (Redux Toolkit)**: Used for complex, cross-component states (such as active POS carts, pending cash transactions, and offline transaction logs).

### 6.4 API Layer Integration
* **Axios Instance**: Configured with a `baseURL` mapping `/api/v1` and a dynamic timeout.
* **Request Interceptor**: Adds the active access token and `X-Tenant-ID` header to requests.
* **Response Interceptor**: Intercepts `401 Unauthorized` responses, triggers the refresh token call automatically, and retries the original request seamlessly.

---

## 7. Backend Architecture

### 7.1 NestJS Modular Architecture
NestJS modules group controllers, services, database interfaces, and dependency routing boundaries:

```
[Module Decorator]
  ├── Imports: (PrismaModule, ConfigModule)
  ├── Controllers: (HTTP Endpoints)
  ├── Providers/Services: (Business Logic + Database calls)
  └── Exports: (Services made available to import modules)
```

### 7.2 System Components

```
Request Pipeline
  [HTTP Request]
       │
       ▼
   [Guards] (AuthGuard, RolesGuard)
       │
       ▼
   [Interceptors] (TenantScopingInterceptor, ResponseInterceptor)
       │
       ▼
   [Pipes] (ValidationPipe - DTO transforms)
       │
       ▼
  [Controller] (Endpoint Handler)
       │
       ▼
   [Service] (Business Logic)
       │
       ▼
  [Prisma ORM] (Scoped query execution)
```

* **DTO Strategy**: Every endpoint input is mapped to a class decorated with validation annotations (such as `@IsString`, `@IsNotEmpty`, `@Min`).
* **Validation Pipe**: Translates incoming requests into validated DTO class instances, returning a formatted `400 Bad Request` array of errors if validation fails.
* **Exception Filter**: Translates validation and database errors into a uniform JSON response payload:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [
      { "field": "sellingPrice", "message": "sellingPrice must be greater than or equal to purchasePrice" }
    ],
    "timestamp": "2026-07-14T13:01:40.000Z"
  }
  ```

---

## 8. API Design

All API endpoints follow REST naming conventions, utilizing lowercase nouns with hyphens for resource paths.

### 8.1 Authentication Endpoints (`/api/v1/auth`)
* `POST /auth/register`
  * Body: `{ email, password, firstName, lastName, tenantName, slug }`
  * Response: `201 Created`
* `POST /auth/login`
  * Body: `{ email, password }`
  * Response: `200 OK` + HTTP-Only Cookie + Access Token
* `POST /auth/refresh`
  * Body: `None` (Reads Refresh Cookie)
  * Response: `200 OK` + New Access Token + New Cookie
* `POST /auth/logout`
  * Body: `None`
  * Response: `204 No Content` (Clears Cookie & invalidates token)

### 8.2 Inventory & Catalog Endpoints (`/api/v1/products`)
* `GET /products?page=1&limit=20&search=milk`
  * Headers: `Authorization: Bearer <JWT>`, `X-Tenant-ID: <UUID>`
  * Response: `200 OK` with paginated product array
* `POST /products`
  * Body: `{ name, sku, barcode, purchasePrice, sellingPrice, categoryId, alertThreshold }`
  * Response: `201 Created`
* `PUT /products/:id`
  * Body: `{ name, purchasePrice, sellingPrice, categoryId, alertThreshold }`
  * Response: `200 OK`
* `PATCH /products/:id/adjust-stock`
  * Body: `{ quantity, type: "MANUAL_ADJUSTMENT", notes }`
  * Response: `200 OK`

### 8.3 POS Billing Endpoints (`/api/v1/invoices`)
* `POST /invoices`
  * Body:
    ```json
    {
      "customerId": "uuid",
      "paymentMethod": "SPLIT",
      "discountAmount": 5.00,
      "items": [
        { "productId": "uuid", "quantity": 2, "discountAmount": 0.00 }
      ],
      "payments": [
        { "paymentMethod": "CASH", "amount": 10.00 },
        { "paymentMethod": "UPI", "amount": 15.00 }
      ]
    }
    ```
  * Response: `201 Created` with created invoice details.

---

## 9. Security Architecture

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **SQL Injection** | Parameterized Database queries | Prisma ORM uses parameterized queries automatically. Native query usage must be restricted to explicitly defined safe cases. |
| **Cross-Site Scripting (XSS)**| Content Security Policy & Context Sanitization | Set up security headers (Helmet in NestJS), sanitize input arrays, and ensure React handles markup updates securely. |
| **CSRF** | CSRF Token & SameSite Cookie controls | Use custom HTTP authorization headers instead of cookie-based routing for API validation. Set refresh token cookies to `SameSite=Strict`. |
| **Brute Force Attacks** | Rate Limiting | Use `nestjs-throttler` globally to rate-limit auth routes to 5 requests per minute, and other routes to 100 requests per minute per IP. |
| **Token Theft** | Secure Storage | Keep short-lived Access Tokens in application memory, and Refresh Tokens in secure `HttpOnly`, `Secure` SameSite cookies. |
| **Password Leakage** | Cryptographic Hashing | Store credentials using the `Argon2id` or `bcrypt` hashing algorithm with a work factor of 10 or higher. |
| **Data Leakage** | Query Scoping | Multi-tenant isolation is enforced at the database query builder level (Prisma middleware) to filter database access by tenant. |

---

## 10. Inventory Strategy (Double-Entry Log Ledger)

We avoid directly modifying a product's stock levels. Instead, we use an **Inventory Transaction Ledger** pattern to ensure auditability and data integrity.

### 10.1 Why Use an Inventory Transaction Ledger?
* **Auditability**: Every stock change is backed by an auditable record linked to a system user.
* **Accuracy**: Prevents race conditions during concurrent stock updates (e.g., simultaneous sales).
* **Analytics**: Simplifies calculations for historical stock levels, Cost of Goods Sold (COGS), shrinkage patterns, and profit margins.

### 10.2 Operations Design (Transactions Mapping)
```
[New Stock Entry / Sale] 
       │
       ▼
[Database Transaction]
  ├── Lock Product row: SELECT * FROM "Product" WHERE id = X FOR UPDATE
  ├── Create InventoryTransaction record (quantity, type, unitCost)
  ├── Calculate new total: stock = current_stock +/- transaction_qty
  └── Save Product stock update
```

---

## 11. Billing Architecture

The POS checkout process uses real-time client-side calculation, and dispatches background processing jobs to BullMQ.

```
       [Client POS Checkout]
                 │
                 ▼
      [Select Sale Parameters] 
  (Barcode / SKU Search / Quick-Grid UI)
                 │
                 ▼
       [Add Item to POS Cart]
  (Auto-applied offer / discount calculations)
                 │
                 ▼
       [Submit POS Transaction]
  (Cash, Card, UPI, Credit, Split Payments)
                 │
                 ▼
          [Save Invoice]
                 │
                 ├──► [Local React UI: Print thermal layout directly via ESC/POS]
                 │
                 └──► [Dispatch Backend Queue (BullMQ)]
                           ├── Generate PDF Receipt (pdfkit/puppeteer)
                           ├── Adjust Stock Levels (Inventory Module)
                           └── Send Email Receipt via Brevo SMTP
```

### 11.1 Printing Architecture
* **Thermal Receipts (POS)**: The React app compiles raw ESC/POS commands and sends them directly to USB/Bluetooth thermal receipt printers using the WebUSB/WebSerial API.
* **Invoice PDFs**: A background worker compiles PDF invoices and saves them to Supabase Storage, generating a shareable link.

---

## 12. Dashboard Analytics & Caching Strategy

To keep the UI responsive, we avoid running heavy database queries (such as SQL SUM and COUNT operations) directly during page loads. Instead, we cache metrics using Redis.

```
Dashboard Request
       │
       ▼
 [Check Redis Cache]
       ├── Cache Hit  ──► Return cached JSON data
       └── Cache Miss ──► Query Database (Prisma aggregates)
                            │
                            ▼
                         Update Redis Cache (TTL = 15 minutes)
                            │
                            ▼
                         Return JSON data
```

### 12.1 Real-Time Activity Monitoring
Low-cost metrics (such as today's sales count) are incremented in Redis in real time using atomic commands (`INCRBY`). Heavy aggregates (like monthly profit margin analysis) are recalculated periodically by background cron jobs.

---

## 13. Background Jobs (BullMQ Routing Design)

We offload resource-intensive and asynchronous tasks to BullMQ workers powered by Redis:

* **Email Queue (`email-queue`)**: Dispatches signup notifications, OTPs, and invoice details using Brevo SMTP.
* **Report Engine (`report-queue`)**: Handles heavy CSV and Excel data exports, uploading the generated files to Supabase Storage and notifying users when they are ready.
* **PDF Compiler (`pdf-queue`)**: Converts invoices to standardized PDF files.
* **SaaS Billing Tracker (`billing-cron-queue`)**: Runs daily checks for subscription renewals and handles overdue payment follow-ups.

---

## 14. Deployment Architecture

```
                                [Client Request]
                                       │
                                       ▼
                       [Cloudflare DNS / Edge Network]
                                       │
                                       ▼
                      [Vercel Serverless (Frontend App)]
                                       │ (HTTPS API Call)
                                       ▼
                     [Nginx Reverse Proxy / SSL Gateway]
                                       │
                                       ▼
                       [NestJS API Container Cluster]
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [Supabase Database Server]                    [Redis Cache & Queue Engine]
```

### 14.1 Production Environment Deployment Parameters
* **Frontend**: Automatically deployed to Vercel global CDN nodes from git branch pushes.
* **Backend API**: Packaged as Docker containers and deployed to Railway.
* **Database**: Hosted on Supabase (PostgreSQL with built-in connection pooling).
* **Caching & Queue**: A managed Redis cluster manages cache and background queues.

---

## 15. Environment Variables

### 15.1 Frontend (React App)
```bash
VITE_API_URL=https://api.my-billing-saas.com/api/v1
VITE_APP_ENV=production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxx
```

### 15.2 Backend (NestJS Server)
```bash
PORT=3000
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
REDIS_URL=redis://default:password@redis-server.com:6379
JWT_SECRET=super-secret-jwt-key
JWT_REFRESH_SECRET=super-secret-jwt-refresh-key
STRIPE_SECRET_KEY=sk_live_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx
BREVO_API_KEY=xkeysib-xxxxxx
SUPABASE_STORAGE_URL=https://xxxx.supabase.co/storage/v1/object/public
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 16. Coding Standards

### 16.1 General Formatting & Naming
* **File Naming**: PascalCase for React components (e.g. `BillingCart.tsx`), camelCase for standard TypeScript files (e.g. `authGuard.ts`).
* **Typescript**: Enable `strict: true` and prohibit the use of `any` types.
* **Functions**: Limit function lengths to 50 lines. Keep components under 300 lines by splitting large forms and charts into smaller components.

### 16.2 Standard API Response Format
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 120
  }
}
```

### 16.3 Git Commit Conventions
Follow the Angular Git Commit Guidelines:
* `feat`: A new feature (e.g. `feat(billing): add thermal printing functionality`)
* `fix`: A bug fix (e.g. `fix(auth): fix token rotation issue`)
* `refactor`: Code restructuring without functional modifications (e.g. `refactor(db): add index columns`)

---

## 17. Development Roadmap

```
[Phase 1: Core Setup] ──► [Phase 2: Auth & Organization] ──► [Phase 3: Catalog & Suppliers]
                                                                        │
                                                                        ▼
[Phase 6: Admin Portal] ◄── [Phase 5: POS & Checkout]    ◄── [Phase 4: Inventory Logistics]
          │
          ▼
[Phase 7: System Release]
```

### 17.1 Phase breakdown

#### Phase 1: Core Platform Setup
* Initialize monorepo directory structure.
* Configure database schema and migrations.
* Run standard service tests to verify setups.

#### Phase 2: Authentication & Organization Profiles
* Implement multi-tenant login, registration, and role-based permissions (RBAC).
* Configure tenant custom setting panels.

#### Phase 3: Product Catalog & Suppliers Directory
* Build interface structures for product collections and supplier catalogs.
* Configure CSV import pipelines.

#### Phase 4: Inventory Logistics (Stock Control)
* Build inventory logging engines.
* Add stock thresholds and low-stock alerts.

#### Phase 5: POS Checkout & Billing
* Build the Point of Sale interface, including item grids, barcode scanning, taxes, discounts, and split payment methods.
* Configure thermal receipt printing drivers.

#### Phase 6: Master SaaS Admin Portal
* Build administration views for platform metrics, plan controls, and billing reports.

#### Phase 7: Production Release & Deployment
* Set up CI/CD pipelines.
* Deploy applications on Vercel and Railway, configure Cloudflare rules, and test backup procedures.

---

## 18. Future Scalability Plan

* **Multi-Store Management**: Expand the schema by introducing a `Store` entity between `Tenant` and child tables (like `Invoice` and `Product`).
* **Event-Driven Architecture**: Transition to an event-driven architecture using Kafka or RabbitMQ for complex cross-system updates as transaction volumes grow.
* **AI Business Intelligence**: Implement machine learning models to analyze sales histories and predict customer demand or optimal restocking levels.

---

## 19. Risks and Recommendations

* **Data Partitioning**: In the future, a single Postgres database may struggle to handle write operations from thousands of active tenants. We recommend partitioning large transaction tables (such as `InventoryTransaction` and `InvoiceItem`) by range or hash using the `tenantId`.
* **Prisma Overhead**: Prisma can sometimes be slow when executing large batch updates. For heavy write operations (like bulk stock importing or high-volume sales days), we recommend using raw SQL transactions via `prisma.$executeRaw` to maintain high performance.
