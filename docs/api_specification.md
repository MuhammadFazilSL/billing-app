# REST API Specification

This document provides a detailed specification for the REST API of the Multi-Tenant SaaS Billing & Shop Management System.

All endpoints are versioned and prefixed with `/api/v1`. Requests and responses follow the standards defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Global Request and Response Conventions

### 1.1 Headers
All authenticated API calls must provide the following headers:
* `Authorization: Bearer <JWT_ACCESS_TOKEN>`
* `X-Tenant-ID: <TENANT_UUID>` (Enforces request scoping to the tenant)

### 1.2 Standard Success Response Envelope
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

### 1.3 Standard Error Response Envelope
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field validation issue details"
    }
  ],
  "timestamp": "2026-07-14T13:42:00.000Z"
}
```

---

## 2. Authentication Module (`/api/v1/auth`)

### 2.1 User Registration (`POST /auth/register`)
* **Purpose**: Register a new tenant business and the owner admin account.
* **Authentication**: None
* **Permission Required**: None

#### Request Payload
```json
{
  "email": "owner@retailstore.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantName": "Retail Shop Inc",
  "slug": "retail-shop"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "tenantId": "fa7b864a-2512-4c22-b5e1-51200155b9e0",
    "email": "owner@retailstore.com",
    "slug": "retail-shop"
  }
}
```

#### Errors
* `400 Bad Request`: Validation failure (e.g., weak password, slug contains illegal characters).
* `409 Conflict`: Email or tenant slug already exists.

---

### 2.2 User Login (`POST /auth/login`)
* **Purpose**: Authenticate credentials, setting a secure cookie containing a refresh token and returning an access token.
* **Authentication**: None
* **Permission Required**: None

#### Request Payload
```json
{
  "email": "owner@retailstore.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
* **Headers**: `Set-Cookie: refreshtoken=<JWT>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800`
* **Body**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "email": "owner@retailstore.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["Owner"]
    }
  }
}
```

#### Errors
* `401 Unauthorized`: Invalid credentials or suspended account status.

---

### 2.3 Token Refresh (`POST /auth/refresh`)
* **Purpose**: Rotate refresh token cookie and return a new short-lived access token.
* **Authentication**: Cookie Authentication (`refreshtoken` cookie)
* **Permission Required**: None

#### Request Payload
* None (Reads cookie)

#### Response (200 OK)
* **Headers**: `Set-Cookie: refreshtoken=<NEW_JWT>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800`
* **Body**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Errors
* `401 Unauthorized`: Expired, missing, or blacklisted refresh token.

---

## 3. Product Catalog Module (`/api/v1/products`)

### 3.1 List Products (`GET /products`)
* **Purpose**: Retrieve a paginated list of catalog products. Supports text searching, categories, and stock filtering.
* **Authentication**: Bearer Token
* **Permission Required**: `products:read`

#### Request Query Parameters
* `page` (optional): Default `1`
* `limit` (optional): Default `20`
* `search` (optional): Match name, SKU, or barcode
* `categoryId` (optional): Filter by category
* `lowStock` (optional): Boolean (`true`) to return only items below their alert threshold

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "e91244da-6022-4bb3-a3d1-419b486a4221",
      "name": "Wireless Mouse M185",
      "sku": "MS-W185",
      "barcode": "097855088824",
      "purchasePrice": 10.00,
      "sellingPrice": 19.99,
      "stock": 42.000,
      "alertThreshold": 5.000,
      "taxRate": 8.25,
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 145
  }
}
```

---

### 3.2 Create Product (`POST /products`)
* **Purpose**: Create a new product record inside the catalog.
* **Authentication**: Bearer Token
* **Permission Required**: `products:write`

#### Request Payload
```json
{
  "name": "Mechanical Keyboard K840",
  "sku": "KB-M840",
  "barcode": "097855099901",
  "description": "Aluminum design mechanical keyboard",
  "purchasePrice": 45.00,
  "sellingPrice": 79.99,
  "alertThreshold": 3.000,
  "taxRate": 8.25,
  "categoryId": "22ffbe55-8854-4444-ac10-1845bb0e02aa"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "f512ccaa-2254-411a-bf41-01824bb88251",
    "name": "Mechanical Keyboard K840",
    "sku": "KB-M840",
    "stock": 0.000,
    "status": "ACTIVE"
  }
}
```

#### Errors
* `400 Bad Request`: Validation failure (e.g. `sellingPrice < purchasePrice`).
* `409 Conflict`: SKU or barcode already registered for this tenant.

---

## 4. POS Billing Module (`/api/v1/invoices`)

### 4.1 Checkout Invoice (`POST /invoices`)
* **Purpose**: Submits a client sales order, decrements catalog stock, and registers the transaction payments.
* **Authentication**: Bearer Token
* **Permission Required**: `billing:process`

#### Request Payload
```json
{
  "customerId": "81fcecaa-2210-482a-ac51-0129ffb118a1",
  "discountAmount": 5.00,
  "paymentMethod": "SPLIT",
  "items": [
    {
      "productId": "e91244da-6022-4bb3-a3d1-419b486a4221",
      "quantity": 2.000,
      "discountAmount": 0.00
    }
  ],
  "payments": [
    {
      "paymentMethod": "CASH",
      "amount": 15.00
    },
    {
      "paymentMethod": "UPI",
      "amount": 19.98,
      "transactionReference": "UPI-TXN-998822"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "119fccda-a212-4c22-9982-f5421ab77bb2",
    "invoiceNumber": "INV-2026-00014",
    "subTotal": 39.98,
    "discountAmount": 5.00,
    "taxAmount": 0.00,
    "grandTotal": 34.98,
    "amountPaid": 34.98,
    "balanceDue": 0.00,
    "paymentStatus": "PAID"
  }
}
```

#### Errors
* `400 Bad Request`: Incorrect payment sum matching grand total, or customer balance issues.
* `422 Unprocessable Entity`: Insufficient product stock (e.g. requested quantity exceeds available stock levels).

---

## 5. Inventory Operations Module (`/api/v1/inventory`)

### 5.1 Manual Stock Adjustment (`PATCH /inventory/adjust`)
* **Purpose**: Records inventory adjustments (e.g. adjustments for damaged, lost, or found products).
* **Authentication**: Bearer Token
* **Permission Required**: `inventory:adjust`

#### Request Payload
```json
{
  "productId": "e91244da-6022-4bb3-a3d1-419b486a4221",
  "quantity": 2.000,
  "type": "DAMAGE",
  "notes": "Liquid spill in aisle 4"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "productId": "e91244da-6022-4bb3-a3d1-419b486a4221",
    "transactionType": "DAMAGE",
    "adjustedQuantity": 2.000,
    "direction": "OUT",
    "newStockLevel": 40.000
  }
}
```

---

## 6. SaaS Subscription Webhooks (`/api/v1/webhooks`)

### 6.1 Stripe Gateway Webhook (`POST /webhooks/stripe`)
* **Purpose**: Processes asynchronous checkout completion events sent by the billing portal gateway.
* **Authentication**: Signature Validation (`Stripe-Signature` Header verification)
* **Permission Required**: None

#### Request Payload
* Raw Event Byte Payload

#### Response (200 OK)
```json
{
  "received": true
}
```
