# Backend Modules Specification

This document describes the NestJS modular architecture, service divisions, controllers, DTO requirements, and dependencies for the API application layer.

All module layouts align with the guidelines defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Application Layer Layout & Architecture

The NestJS backend is structured as a collection of cohesive feature modules. Each module encapsulates its controllers, services, database wrappers, and internal providers:

```
[Request] --> Controller (Routing, Guards, Pipes) --> Service (Transactions, Business Rules) --> Prisma (Postgres)
```

---

## 2. Core System Modules

### 2.1 Auth Module (`AuthModule`)
* **Responsibilities**: Handles user credentials authentication, token generation (JWT), Refresh Token rotation, and password checks.
* **Services**:
  * `AuthService`: Validates credentials, issues JWT access tokens, and processes refresh actions.
  * `JwtStrategy` & `LocalStrategy`: Passport strategies for validating routes.
* **Controllers**:
  * `AuthController`: Exposes authentication endpoints (`/login`, `/register`, `/refresh`, `/logout`).
* **DTOs**:
  * `RegisterDto`, `LoginDto`
* **Dependencies**: `UsersModule`, `TenantModule`, `ConfigModule`.
* **Security Context**: Applies local and JWT strategies. Sets the Refresh token as an HTTP-only cookie.

---

### 2.2 Tenant Module (`TenantModule`)
* **Responsibilities**: Manages tenant account limits, profile settings, and system-defined role templates.
* **Services**:
  * `TenantService`: Handles onboarding logic, updates currency settings, and validates active statuses.
* **Controllers**:
  * `TenantController`: Manages tenant profile updates and logo changes.
* **DTOs**:
  * `UpdateTenantDto`, `CheckSlugDto`
* **Dependencies**: `PrismaModule`.
* **Tenant Isolation**: Serves as the central manager for validating tenant scope configurations.

---

### 2.3 Products Module (`ProductsModule`)
* **Responsibilities**: Manages catalog entries, brands, categories, SKU values, and taxes.
* **Services**:
  * `ProductsService`: Handles product CRUD operations, imports CSV records, and fetches catalogs.
* **Controllers**:
  * `ProductsController`: Handles CRUD endpoints for products, categories, and brands.
* **DTOs**:
  * `CreateProductDto`, `UpdateProductDto`, `ProductQueryDto`
* **Dependencies**: `PrismaModule`.
* **Future Extensions**: Dynamic tag management and multi-level tax rules.

---

### 2.4 Inventory Module (`InventoryModule`)
* **Responsibilities**: Records all stock movements, tracks adjustments, and processes low-stock alerts.
* **Services**:
  * `InventoryService`: Creates `InventoryTransaction` records and updates product stock levels inside database transactions.
* **Controllers**:
  * `InventoryController`: Handles manual adjustment requests and transaction audits.
* **DTOs**:
  * `AdjustStockDto`, `TransactionQueryDto`
* **Dependencies**: `PrismaModule`, `NotificationsModule`.
* **Business Logic**: Implements the Inventory Transaction Ledger pattern. Directly updates the product catalog table within transaction boundaries.

---

### 2.5 Billing Module (`BillingModule`)
* **Responsibilities**: Processes checkout requests, invoice generation, card payment records, and POS transactions.
* **Services**:
  * `BillingService`: Processes carts, calculates taxes/discounts, records split payments, and generates unique invoice numbers.
* **Controllers**:
  * `InvoiceController`: Handles checkout, invoice list fetching, and returns.
* **DTOs**:
  * `CheckoutDto`, `InvoiceQueryDto`
* **Dependencies**: `PrismaModule`, `InventoryModule`, `NotificationsModule`.
* **Background Jobs**: Dispatches PDF compilation and email receipt delivery tasks to BullMQ queues.

---

### 2.6 Notifications Module (`NotificationsModule`)
* **Responsibilities**: Dispatches transactional emails, alerts, and system warnings.
* **Services**:
  * `NotificationsService`: Formats alert templates and manages active notifications.
  * `EmailWorker`: A BullMQ worker that processes email sending tasks using Brevo APIs.
* **Dependencies**: `ConfigModule`.
* **Asynchronous Design**: All email and SMS deliveries are queued using BullMQ.

---

### 2.7 Subscriptions Module (`SubscriptionsModule`)
* **Responsibilities**: Handles Stripe/Razorpay checkouts, monitors tenant plan updates, and processes billing webhooks.
* **Services**:
  * `SubscriptionService`: Generates gateway redirect URLs and logs billing histories.
* **Controllers**:
  * `WebhookController`: Listens for payment processor webhooks to process subscription renewals.
* **Dependencies**: `TenantModule`, `ConfigModule`.
* **Security**: Enforces raw body verification checks on gateway webhooks.
