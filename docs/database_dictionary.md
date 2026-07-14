# Database Dictionary

This document provides a comprehensive schema description for the PostgreSQL database of the Multi-Tenant SaaS Billing & Shop Management System, mapped via Prisma ORM.

---

## 1. Core Platform Entities

### 1.1 `Plan` Table
* **Purpose**: Manages the available SaaS subscription tiers (e.g., Free, Starter, Professional, Enterprise) and their associated resource quotas and feature toggles.
* **Database Name**: `plans`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `name` | VARCHAR(50) | No | None | Unique name of the subscription plan (e.g., "Professional") |
| `price` | DECIMAL(10, 2) | No | None | Monthly price in USD/default currency |
| `billingCycle` | VARCHAR(20) | No | None | ENUM value: `MONTHLY` or `ANNUALLY` |
| `maxProducts` | INT | No | None | Maximum allowed active products in catalog |
| `maxEmployees` | INT | No | None | Maximum allowed active employee users |
| `maxInvoicesPerMonth` | INT | No | None | Maximum sales invoices processed per calendar month |
| `features` | JSONB | No | `'{}'` | JSON bag of features (e.g., `{"hasAi": true, "hasMultiBranch": false}`) |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp (updated on change) |

#### Indexes
* `PK_plans`: Primary Key index on `id`
* `UQ_plans_name`: Unique constraint on `name`

#### Relationships
* **One-to-Many**: A `Plan` has many `Tenants` (`Tenant.planId` references `Plan.id`).

#### Validation Rules
* `price` must be greater than or equal to `0.00`.
* `maxProducts`, `maxEmployees`, and `maxInvoicesPerMonth` must be positive integers (`> 0`).

#### Business Rules
* Plans cannot be deleted if there are active `Tenants` subscribed to them.
* Changing plan features or limits applies immediately to all subscribed tenants on their next request validation check.

#### Future Expansion Notes
* Multi-currency tier pricing definitions (`prices: JSONB`).

---

### 1.2 `Tenant` Table
* **Purpose**: Represents the top-level business or organization (shop) boundary. Ensures data isolation across the platform.
* **Database Name**: `tenants`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `name` | VARCHAR(100) | No | None | Name of the business/shop |
| `slug` | VARCHAR(100) | No | None | Unique URL-friendly slug used for subdomain routing (e.g., `retail-shop`) |
| `logoUrl` | VARCHAR(255) | Yes | NULL | Public link to logo image stored in Supabase Storage |
| `address` | TEXT | Yes | NULL | Primary physical business address |
| `phone` | VARCHAR(20) | Yes | NULL | Business contact phone number |
| `currency` | VARCHAR(10) | No | `'USD'` | Core transaction currency code |
| `settings` | JSONB | No | `'{}'` | Tenant-specific config parameters (e.g., thermal receipt headers, tax registration numbers) |
| `status` | VARCHAR(20) | No | `'ACTIVE'` | ENUM value: `ACTIVE`, `SUSPENDED`, `DELETED` |
| `planId` | UUID | No | None | Foreign Key (FK) -> `Plan.id` |
| `subscriptionExpiresAt` | TIMESTAMP | No | None | Datetime marking when the current subscription term expires |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp (updated on change) |

#### Indexes
* `PK_tenants`: Primary Key index on `id`
* `UQ_tenants_slug`: Unique constraint on `slug`
* `IX_tenants_status`: Non-unique index on `status` to filter active tenants quickly

#### Relationships
* **Many-to-One**: A `Tenant` belongs to a `Plan` (`planId` -> `Plan.id`).
* **One-to-Many**: A `Tenant` has many:
  * `Users`
  * `Roles`
  * `Customers`
  * `Suppliers`
  * `Products`
  * `Invoices`
  * `Purchases`
  * `Expenses`
  * `SubscriptionTransactions`

#### Validation Rules
* `slug` must match regex `^[a-z0-9-]+$` (alphanumeric and hyphens only).
* `currency` must be a valid ISO 4217 code (length 3).

#### Business Rules
* If `subscriptionExpiresAt` is past the current system date, tenant state transitions to a restricted mode (billing lock), allowing access to report histories but blocking new transaction generation (Invoices, Purchases, etc.).
* Transitioning `status` to `SUSPENDED` instantly blocks JWT authentication tokens for all associated users.

---

### 1.3 `SubscriptionTransaction` Table
* **Purpose**: Holds billing history ledger entries for the tenant SaaS subscriptions.
* **Database Name**: `subscription_transactions`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `amount` | DECIMAL(10, 2) | No | None | Transaction payment amount |
| `paymentStatus` | VARCHAR(20) | No | None | ENUM value: `SUCCESSFUL`, `FAILED`, `PENDING` |
| `paymentGateway` | VARCHAR(50) | No | None | Gateway name (e.g., `STRIPE`, `RAZORPAY`) |
| `gatewayReference` | VARCHAR(100) | Yes | NULL | External invoice/charge ID from gateway provider |
| `billingPeriodStart`| TIMESTAMP | No | None | Coverage start date |
| `billingPeriodEnd` | TIMESTAMP | No | None | Coverage end date |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |

#### Indexes
* `PK_subscription_transactions`: Primary Key index on `id`
* `IX_subscription_tx_tenant`: Index on `tenantId` for quick billing history rendering

#### Relationships
* **Many-to-One**: A `SubscriptionTransaction` belongs to a `Tenant` (`tenantId` -> `Tenant.id`).

---

## 2. User & Access Control Management (RBAC)

### 2.1 `User` Table
* **Purpose**: Manages system authentication credentials, contact settings, and global admin identifiers.
* **Database Name**: `users`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `email` | VARCHAR(100) | No | None | Primary login ID |
| `passwordHash` | VARCHAR(255) | No | None | Secure Argon2id/bcrypt crypt-hash |
| `firstName` | VARCHAR(50) | No | None | User's first name |
| `lastName` | VARCHAR(50) | No | None | User's last name |
| `phone` | VARCHAR(20) | Yes | NULL | Contact phone number |
| `tenantId` | UUID | Yes | NULL | Foreign Key (FK) -> `Tenant.id` (NULL for Master Platform Admins) |
| `status` | VARCHAR(20) | No | `'ACTIVE'` | ENUM value: `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `isMasterAdmin` | BOOLEAN | No | `false` | Global platform administration flag |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp (updated on change) |

#### Indexes
* `PK_users`: Primary Key index on `id`
* `UQ_users_email`: Unique constraint on `email`
* `IX_users_tenant`: Index on `tenantId` to query employee rosters quickly

#### Relationships
* **Many-to-One**: A `User` belongs to a `Tenant` (`tenantId` -> `Tenant.id`).
* **Many-to-Many**: A `User` can hold multiple `Roles` bridged through the `UserRole` table.

#### Validation Rules
* `email` must validate as a valid email string.
* `firstName` and `lastName` must contain only alphabetic characters and have a maximum length of 50.

#### Business Rules
* Deleting a `Tenant` cascade-deletes all child `Users` associated with that tenant.
* If `isMasterAdmin` is `true`, `tenantId` must be NULL.

---

### 2.2 `Role` Table
* **Purpose**: Custom/Predefined organizational classifications containing localized privileges.
* **Database Name**: `roles`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `name` | VARCHAR(50) | No | None | Name of the role (e.g., "Cashier") |
| `description` | TEXT | Yes | NULL | Purpose of the role |
| `isSystemRole` | BOOLEAN | No | `false` | System-defined roles (e.g., "Owner") that cannot be altered or deleted |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |

#### Indexes
* `PK_roles`: Primary Key index on `id`
* `UQ_roles_tenant_name`: Unique composite constraint on `(tenantId, name)` to prevent duplicate roles inside a single tenant

#### Relationships
* **Many-to-One**: A `Role` belongs to a `Tenant` (`tenantId` -> `Tenant.id`).
* **Many-to-Many**:
  * Linked to `Permissions` via the `RolePermission` table.
  * Linked to `Users` via the `UserRole` table.

#### Business Rules
* System roles (`isSystemRole` = `true`) cannot be modified or deleted by users.

---

### 2.3 `Permission` Table
* **Purpose**: System-wide access controls (e.g. `products:create`, `billing:process`).
* **Database Name**: `permissions`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `code` | VARCHAR(50) | No | None | Permission access code (e.g., `invoices:create`) |
| `description` | VARCHAR(255) | No | None | Description of the permission |

#### Indexes
* `PK_permissions`: Primary Key index on `id`
* `UQ_permissions_code`: Unique constraint on `code`

---

### 2.4 `RolePermission` Table
* **Purpose**: Many-to-many join table mapping `Roles` to `Permissions`.
* **Database Name**: `role_permissions`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `roleId` | UUID | No | None | Composite PK, FK -> `Role.id` |
| `permissionId` | UUID | No | None | Composite PK, FK -> `Permission.id` |

#### Indexes
* `PK_role_permissions`: Primary composite PK on `(roleId, permissionId)`

---

### 2.5 `UserRole` Table
* **Purpose**: Many-to-many join table mapping `Users` to `Roles`.
* **Database Name**: `user_roles`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | UUID | No | None | Composite PK, FK -> `User.id` |
| `roleId` | UUID | No | None | Composite PK, FK -> `Role.id` |

#### Indexes
* `PK_user_roles`: Primary composite PK on `(userId, roleId)`

---

## 3. CRM & Supplier Relations (CRM/SRM)

### 3.1 `Customer` Table
* **Purpose**: Holds profiles of business clients, their store credit balance, and loyalty points.
* **Database Name**: `customers`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `name` | VARCHAR(100) | No | None | Full name of the customer |
| `email` | VARCHAR(100) | Yes | NULL | Contact email address |
| `phone` | VARCHAR(20) | Yes | NULL | Contact phone number |
| `address` | TEXT | Yes | NULL | Billing/Shipping address details |
| `outstandingBalance` | DECIMAL(12, 2)| No | `0.00` | Current outstanding debt balance |
| `loyaltyPoints` | INT | No | `0` | Loyalty points accumulated |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |

#### Indexes
* `PK_customers`: Primary Key index on `id`
* `IX_customers_tenant_phone`: Index on `(tenantId, phone)` to search for customers at the POS

#### Validation Rules
* `outstandingBalance` can be positive (meaning debt) or negative (meaning credit balance/prepayment).

---

### 3.2 `Supplier` Table
* **Purpose**: Profiles suppliers and tracks their outstanding balances.
* **Database Name**: `suppliers`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `companyName` | VARCHAR(100) | No | None | Vendor company identifier |
| `contactName` | VARCHAR(100) | Yes | NULL | Point of contact name |
| `email` | VARCHAR(100) | Yes | NULL | Business email |
| `phone` | VARCHAR(20) | Yes | NULL | Contact phone |
| `address` | TEXT | Yes | NULL | Office or warehouse address |
| `outstandingBalance` | DECIMAL(12, 2)| No | `0.00` | Amount owed to the supplier |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |

#### Indexes
* `PK_suppliers`: Primary Key index on `id`
* `IX_suppliers_tenant`: Index on `tenantId` for filtering lists

---

## 4. Product Catalog & Inventory Logistics

### 4.1 `Product` Table
* **Purpose**: Primary register of active goods, barcode associations, pricing models, and stock aggregates.
* **Database Name**: `products`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `name` | VARCHAR(150) | No | None | Name of the product |
| `sku` | VARCHAR(50) | Yes | NULL | Stock Keeping Unit (Unique per tenant) |
| `barcode` | VARCHAR(50) | Yes | NULL | Standard product barcode value |
| `description` | TEXT | Yes | NULL | Product description |
| `purchasePrice` | DECIMAL(10, 2) | No | None | Default purchase cost |
| `sellingPrice` | DECIMAL(10, 2) | No | None | Standard retail selling price |
| `stock` | DECIMAL(12, 3) | No | `0.000` | Stock level (allows fractionals for weight-based units) |
| `alertThreshold` | DECIMAL(12, 3) | No | `5.000` | Triggers low-stock alerts |
| `taxRate` | DECIMAL(5, 2) | No | `0.00` | Default VAT/Sales Tax rate |
| `categoryId` | UUID | Yes | NULL | Foreign Key (FK) -> `Category.id` |
| `brandId` | UUID | Yes | NULL | Foreign Key (FK) -> `Brand.id` |
| `status` | VARCHAR(20) | No | `'ACTIVE'` | ENUM value: `ACTIVE`, `INACTIVE`, `ARCHIVED` |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |
| `updatedAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Audit timestamp |

#### Indexes
* `PK_products`: Primary Key index on `id`
* `UQ_products_tenant_sku`: Unique constraint on `(tenantId, sku)` to prevent duplicate SKUs within a tenant
* `UQ_products_tenant_barcode`: Unique constraint on `(tenantId, barcode)` to prevent duplicate barcodes within a tenant
* `IX_products_tenant_stock`: Index on `(tenantId, stock)` to identify low-stock items quickly

#### Validation Rules
* `purchasePrice` and `sellingPrice` must be greater than or equal to `0.00`.
* `sellingPrice` must be greater than or equal to `purchasePrice`.

#### Business Rules
* Direct manual edits to `stock` are blocked. All adjustments must go through `InventoryTransaction` inputs, which update this column inside a database transaction.

---

### 4.2 `InventoryTransaction` Table
* **Purpose**: Audit ledger for all stock adjustments, sales, purchases, damages, and returns.
* **Database Name**: `inventory_transactions`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `productId` | UUID | No | None | Foreign Key (FK) -> `Product.id` |
| `type` | VARCHAR(30) | No | None | ENUM: `PURCHASE`, `SALE`, `RETURN_FROM_CUSTOMER`, `RETURN_TO_SUPPLIER`, `DAMAGE`, `MANUAL_ADJUSTMENT` |
| `quantity` | DECIMAL(12, 3) | No | None | Amount changed (always positive) |
| `direction` | VARCHAR(5) | No | None | ENUM: `IN` (addition) or `OUT` (reduction) |
| `unitCost` | DECIMAL(10, 2) | No | None | Unit cost of items at the time of the transaction |
| `referenceId` | UUID | Yes | NULL | Linked ID (e.g., `InvoiceId`, `PurchaseId`) |
| `userId` | UUID | No | None | Foreign Key (FK) -> `User.id` (Who authorized the transaction) |
| `notes` | TEXT | Yes | NULL | Reason for manual adjustments or damage reports |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Transaction timestamp |

#### Indexes
* `PK_inventory_transactions`: Primary Key index on `id`
* `IX_inventory_tx_composite`: Composite index on `(tenantId, productId, createdAt)` for historical stock calculations

#### Business Rules
* Row entries in this table are **append-only** and cannot be updated or deleted, preserving audit integrity.
* Any stock correction requires generating a new transaction row of type `MANUAL_ADJUSTMENT` with a descriptive note.

---

## 5. Sales & Transactional Billing

### 5.1 `Invoice` Table
* **Purpose**: Records completed customer sales invoices and payment summaries.
* **Database Name**: `invoices`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `invoiceNumber` | VARCHAR(50) | No | None | Human-readable transaction identifier unique within the tenant (e.g., `INV-00104`) |
| `customerId` | UUID | Yes | NULL | Foreign Key (FK) -> `Customer.id` (NULL for walk-in cash sales) |
| `subTotal` | DECIMAL(12, 2) | No | None | Invoice total before discounts and taxes |
| `discountAmount` | DECIMAL(12, 2) | No | `0.00` | Applied discount amount |
| `taxAmount` | DECIMAL(12, 2) | No | None | Total calculated tax |
| `grandTotal` | DECIMAL(12, 2) | No | None | Total amount due (`subTotal - discount + tax`) |
| `amountPaid` | DECIMAL(12, 2) | No | None | Total payments recorded against the invoice |
| `balanceDue` | DECIMAL(12, 2) | No | None | Remaining unpaid balance |
| `paymentStatus` | VARCHAR(20) | No | None | ENUM: `PAID`, `PARTIALLY_PAID`, `UNPAID`, `REFUNDED` |
| `paymentMethod` | VARCHAR(20) | No | None | ENUM: `CASH`, `CARD`, `UPI`, `CREDIT`, `SPLIT` |
| `userId` | UUID | No | None | Foreign Key (FK) -> `User.id` (Who processed the sale) |
| `notes` | TEXT | Yes | NULL | Public notes printed on the receipt |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Transaction timestamp |

#### Indexes
* `PK_invoices`: Primary Key index on `id`
* `UQ_invoices_tenant_number`: Unique constraint on `(tenantId, invoiceNumber)` to prevent duplicate numbers within a tenant
* `IX_invoices_customer`: Index on `(tenantId, customerId)` to quickly pull invoices for a specific customer

#### Validation Rules
* `grandTotal` must equal `subTotal - discountAmount + taxAmount`.
* `balanceDue` must equal `grandTotal - amountPaid`.

---

### 5.2 `InvoiceItem` Table
* **Purpose**: Records line items for sales invoices, snapshotting product prices at the time of the sale.
* **Database Name**: `invoice_items`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `invoiceId` | UUID | No | None | Foreign Key (FK) -> `Invoice.id` (Cascade delete on parent removal) |
| `productId` | UUID | No | None | Foreign Key (FK) -> `Product.id` |
| `productName` | VARCHAR(150) | No | None | Snapshotted product name |
| `quantity` | DECIMAL(12, 3) | No | None | Purchased quantity |
| `unitPrice` | DECIMAL(10, 2) | No | None | Charged price per unit (after general markdown) |
| `unitCost` | DECIMAL(10, 2) | No | None | Snapshotted purchase cost (used to calculate margins) |
| `taxRate` | DECIMAL(5, 2) | No | None | Snapshotted tax rate percentage |
| `taxAmount` | DECIMAL(10, 2) | No | None | Total calculated tax for this line item |
| `discountAmount` | DECIMAL(10, 2) | No | `0.00` | Line-item discount |
| `totalAmount` | DECIMAL(12, 2) | No | None | Line total: `(quantity * unitPrice) + taxAmount - discountAmount` |

#### Indexes
* `PK_invoice_items`: Primary Key index on `id`
* `IX_invoice_items_invoice`: Index on `invoiceId` to quickly load invoice line items

---

### 5.3 `InvoicePayment` Table
* **Purpose**: Tracks payment methods for invoices, supporting split-payment checkouts.
* **Database Name**: `invoice_payments`

#### Columns
| Column Name | Data Type | Nullable | Default | Description / Key Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `gen_random_uuid()` | Primary Key (PK) |
| `tenantId` | UUID | No | None | Foreign Key (FK) -> `Tenant.id` |
| `invoiceId` | UUID | No | None | Foreign Key (FK) -> `Invoice.id` |
| `paymentMethod` | VARCHAR(20) | No | None | ENUM: `CASH`, `CARD`, `UPI`, `CREDIT` |
| `amount` | DECIMAL(10, 2) | No | None | Payment amount |
| `transactionReference`| VARCHAR(100) | Yes | NULL | External transaction identifier (e.g. Card transaction ID, UPI reference) |
| `createdAt` | TIMESTAMP | No | `CURRENT_TIMESTAMP` | Transaction timestamp |

#### Indexes
* `PK_invoice_payments`: Primary Key index on `id`
* `IX_invoice_payments_invoice`: Index on `invoiceId` to quickly query payments for an invoice
