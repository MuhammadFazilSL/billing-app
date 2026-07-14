# Testing Strategy & Quality Assurance

This document defines the testing methodology, directory structures, tools, and validation rules used to ensure high quality in both the frontend and backend applications.

All operations follow the guidelines defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Testing Pyramid Overview

We adopt a structured testing strategy divided into three main layers:

```
     / \
    /   \      E2E Testing (Playwright) - Focuses on critical POS & Checkout user paths.
   /     \
  /       \    Integration Testing (NestJS Test/Supertest) - Validates API endpoints & DB scoping.
 /_________\   Unit Testing (Jest/React Testing Library) - Validates pricing engines & utility functions.
```

---

## 2. Unit Testing Strategy

### 2.1 Backend Unit Tests
* **Target Areas**: Services containing calculations (such as billing math and inventory adjustments).
* **Framework**: Jest.
* **Mocks**: Mock the Prisma client to prevent hitting the physical database during unit tests.

* **Example Component Unit Test (Jest)**:
  ```typescript
  // src/modules/billing/billing.service.spec.ts
  describe('BillingService - Grand Total Calculations', () => {
    it('should compute taxes and discounts correctly', () => {
      const result = calculateInvoiceTotals({
        subTotal: 100.00,
        discountAmount: 10.00,
        taxRate: 10.00, // 10%
      });
      // Grand total calculation: (subtotal - discount) * (1 + taxRate/100)
      expect(result.grandTotal).toBe(99.00);
      expect(result.taxAmount).toBe(9.00);
    });
  });
  ```

### 2.2 Frontend Unit Tests
* **Target Areas**: Shared pure components (`components/ui`) and custom state slices (Redux selectors).
* **Framework**: Vitest + React Testing Library.

---

## 3. Integration Testing Strategy

### 3.1 Backend API Integration Tests
* **Goal**: Validate route controllers, interceptors, pipes, database query scopes, and tenant isolation logic.
* **Framework**: `supertest` executing requests against a test database instance.

* **Tenant Isolation Verification Test**:
  ```typescript
  // test/tenant-isolation.e2e-spec.ts
  it('should prevent Tenant A from reading data from Tenant B', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .set('X-Tenant-ID', `${tenantBId}`) // Trying to access Tenant B
      .expect(403); // Expect access denial from guards
  });
  ```

---

## 4. End-to-End (E2E) Testing (Playwright)

We use Playwright to validate critical user journeys:

* **POS Checkout Flow**:
  1. Log in as an active tenant cashier user.
  2. Load `/app/billing` (POS checkout window).
  3. Scan test barcodes (or search items) to verify cart insertions.
  4. Submit a split payment checkout request.
  5. Validate that a print trigger starts and stock decreases.

* **Execution Command**:
  * Run tests locally: `npx playwright test`

---

## 5. Continuous Integration (CI) Quality Gates

To prevent code degradation, the CI pipeline enforces these quality gates before code review merges are allowed:

1. **Lint Checks**: Code must compile without ESLint warnings (`npm run lint`).
2. **Build Success**: TypeScript compiler tests must run and complete without errors.
3. **Unit Tests Coverages**: All unit tests must pass, targeting 80% coverage on core services.
