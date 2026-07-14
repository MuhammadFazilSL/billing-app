# UI Design System & Component Library

This document specifies the design guidelines, spacing systems, typography scales, color schemes, and accessibility rules for the React client application.

All parameters adhere to the styling constraints defined in the **[Project Rules](file:///d:/personal/billing-saas/docs/project_rules.md)**.

---

## 1. Design Philosophy
We adopt a clean, minimal, and high-contrast styling philosophy designed for desktop use (ideal for fast Point of Sale operations) while remaining fully responsive. The application utilizes a dark-mode first configuration.

---

## 2. Palette & Color System
The color palette uses CSS variables mapped to HSL values, enabling clean dark/light mode toggles.

```css
:root {
  /* Light Theme */
  --background: 0 0% 100%;       /* Pure White */
  --foreground: 224 71.4% 4.1%;  /* Slate Dark */
  --card: 0 0% 100%;
  --card-foreground: 224 71.4% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71.4% 4.1%;
  
  --primary: 220 14% 16%;        /* Deep Charcoal Grey */
  --primary-foreground: 210 20% 98%;
  --secondary: 220 14.3% 95.9%;  /* Light Grey */
  --secondary-foreground: 220.9 39.3% 11%;
  
  --destructive: 0 84.2% 60.2%;  /* Red Crimson */
  --destructive-foreground: 210 20% 98%;
  
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 224 71.4% 4.1%;
  --radius: 0.5rem;
}

.dark {
  /* Dark Theme */
  --background: 224 71.4% 4.1%;  /* Deep Slate/Black */
  --foreground: 210 20% 98%;     /* Cool White */
  --card: 224 71.4% 4.1%;
  --card-foreground: 210 20% 98%;
  --popover: 224 71.4% 4.1%;
  --popover-foreground: 210 20% 98%;
  
  --primary: 210 20% 98%;        /* Bright White/Slate */
  --primary-foreground: 220.9 39.3% 11%;
  --secondary: 215 27.9% 16.9%;  /* Dark Grey */
  --secondary-foreground: 210 20% 98%;
  
  --destructive: 0 62.8% 30.6%;  /* Dark Red */
  --destructive-foreground: 210 20% 98%;
  
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 216 12.2% 83.9%;
}
```

---

## 3. Typography
The system uses the **Inter** sans-serif font family. It is optimized for legibility and clear tabular numerical displays (essential for billing metrics and product SKU tracking).

| Style | Font Size | Line Height | Font Weight | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| Heading 1 (`h1`) | 2.25rem (36px) | 2.5rem | 800 (ExtraBold) | Page Titles |
| Heading 2 (`h2`) | 1.875rem (30px)| 2.25rem | 700 (Bold) | Section Headers |
| Heading 3 (`h3`) | 1.5rem (24px) | 2.0rem | 600 (SemiBold) | Grid Subheadings |
| Body Base | 1.0rem (16px) | 1.5rem | 400 (Regular) | Table rows, general text |
| Body Small | 0.875rem (14px)| 1.25rem | 400 (Regular) | Help texts, labels |
| Tabular Data | 0.875rem (14px)| 1.25rem | 500 (Medium) | Product SKU, invoice prices |

* **Utility**: Apply Tailwind's `tabular-nums` class to tables and numerical values to align columns cleanly.

---

## 4. Spacing System
The UI layout follows an 8-pixel spacing system (using standard Tailwind margins and paddings: `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).

* **Page Layout Margins**:
  * Outer desktop page content: `p-6` or `p-8` depending on container width.
  * Card elements internal padding: `p-6`.
  * Grid gap standard: `gap-6` or `gap-4`.

---

## 5. UI Primitives Specification

### 5.1 Buttons
* **Primary**: High contrast filled container (`bg-primary text-primary-foreground`). Used for submit buttons and POS checkouts.
* **Secondary**: Light background button (`bg-secondary text-secondary-foreground`). Used for cancellations and modal close actions.
* **Destructive**: Red container (`bg-destructive text-destructive-foreground`). Used for removals and voids.
* **States**: Define hover transitions (`transition-colors duration-200`) and disabled states (`disabled:opacity-50 disabled:pointer-events-none`).

### 5.2 Forms & Inputs
* **Layout**: Form fields should stack vertically with a descriptive label above the input and error messages below it:
  ```tsx
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-foreground">Email Address</label>
    <input className="px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring" />
    <span className="text-xs text-destructive">Email is required</span>
  </div>
  ```

### 5.3 Tables (TanStack Table + UI)
* **Headers**: Subtle grey backdrop with small bold labels (`bg-muted/50 text-xs font-semibold`).
* **Rows**: Simple horizontal borders. Alternate row colors (`odd:bg-muted/10`) for readability on wider screens.
* **Paging**: Center alignment for page controls, showing records range (e.g., "Showing 1-10 of 100").

---

## 6. Theme and Accessibility Integration
* **Theme Persistence**: Save user theme preferences in localStorage and inject the `.dark` class class into the document wrapper during bootstrap.
* **Keyboard Navigation**: Buttons, modals, and dropdown components must support tab index controls and close-on-escape events.
* **Color Contrast**: All text must maintain a minimum contrast ratio of 4.5:1 against its background, satisfying WCAG AA criteria.
* **Screen Reader Tags**: Use semantic HTML elements (e.g. `<main>`, `<nav>`, `<header>`, `<footer>`) instead of generic nested `<div>` wrappers.
* **Icons**: Use the Lucide React icon set consistently. Add `aria-hidden="true"` to pure decorative icons.
