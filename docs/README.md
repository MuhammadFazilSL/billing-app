# Documentation Index & System Overview

Welcome to the documentation folder for the Multi-Tenant SaaS Billing & Shop Management System.

This folder contains the complete Software Design Specification (SDS) for building the application.

---

## 1. Documentation Index

Before writing code, developers should familiarize themselves with these documents:

| Document | Purpose / Target Audience | Key Contents |
| :--- | :--- | :--- |
| **[Architecture Blueprint](file:///d:/personal/billing-saas/docs/architecture_blueprint.md)** | Architects, Lead Developers | High-level request flows, component mapping, multi-tenant database designs, and queues. |
| **[Project Rules & Guidelines](file:///d:/personal/billing-saas/docs/project_rules.md)** | All Developers | Coding rules, style guidelines, security rules, Git standards, and package rules. |
| **[Database Dictionary](file:///d:/personal/billing-saas/docs/database_dictionary.md)** | Database Administrators, Backend Devs | Database schemas, table column formats, relationship maps, validation rules, and business rules. |
| **[REST API Specification](file:///d:/personal/billing-saas/docs/api_specification.md)** | Frontend & Backend Developers | Endpoint descriptions, query parameters, request schemas, status codes, and error formats. |
| **[Frontend Pages Specification](file:///d:/personal/billing-saas/docs/frontend_pages.md)** | UI/UX Engineers, Frontend Devs | Screen layouts, React components, state hooks, Redux usage, and POS cart systems. |
| **[Backend Modules Directory](file:///d:/personal/billing-saas/docs/backend_modules.md)** | Backend Developers | NestJS modules, module dependencies, service components, and background workers. |
| **[UI Design System](file:///d:/personal/billing-saas/docs/ui_design_system.md)** | UI/UX Engineers, Frontend Devs | Theme configurations (dark mode), spacing, custom fonts, buttons, forms, tables, and WCAG AA accessibility standards. |
| **[Development Roadmap](file:///d:/personal/billing-saas/docs/development_roadmap.md)** | Project Managers, Developers | Development sprints, task lists, feature goals, estimated complexity, and Definitions of Done. |
| **[Testing & QA Strategy](file:///d:/personal/billing-saas/docs/testing_strategy.md)** | QA Engineers, All Developers | Testing levels (Unit, Integration, E2E), Jest, React Testing Library, and Playwright POS E2E flows. |
| **[Coding Standards](file:///d:/personal/billing-saas/docs/coding_standards.md)** | All Developers | Naming standards (directories, variables, classes), TypeScript rules, and Git commit guidelines. |
| **[Contributing Guidelines](file:///d:/personal/billing-saas/docs/contributing.md)** | Contributers, Developers | Local environment setup, Git branching, PR checklist, and code review criteria. |

---

## 2. Core Architectural Principles Recap

1. **Logical Multi-Tenancy**: Tenant isolation is enforced at the software layer. Every query must scope its execution by the incoming request's `tenantId`.
2. **Immutable Transaction Ledgers**: Stock adjustments, invoice entries, and purchase logs are append-only. Modifying historical transaction records is strictly prohibited.
3. **Strict Validation Control**: All inputs must be validated at runtime. The frontend enforces rules using React Hook Form + Zod, while the backend validates requests using NestJS class-validators.
4. **Asynchronous Background Processing**: Offload resource-intensive tasks (such as PDF receipt compilation and email notifications) to BullMQ background workers to maintain fast response times.
