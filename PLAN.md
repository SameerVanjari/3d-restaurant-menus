# Digital Menu with 3D Visualization – Prototype Plan

## Prototype Goals

The prototype will demonstrate the **core functionality** of the digital menu system:

1. Admin can create a menu with items.
2. Guests can access the menu via a QR code (direct link, no login).
3. Guests can place an order and generate a bill.

---

## Features (Prototype Scope)

### Admin Dashboard

* **Create Menu**

  * Form to create a menu.
  * Add menu items with fields:

    * `name`
    * `image`
    * `description`
    * `price`
    * `category`
* **QR Code Generation**

  * Each menu generates a unique link and QR code for guest access.

### Guest Experience

* **Access Menu**

  * Scan QR → open menu page directly (no authentication).
* **Ordering**

  * Browse items.
  * Add items to cart.
* **Bill Generation**

  * View summary of items with quantity and prices.
  * Generate a simple bill (display on page).
  * For prototype: no actual payment integration (optional “mock payment” button).

---

## Tech Stack (Prototype)

* **Next.js** – framework
* **Shadcn UI + Tailwind CSS** – UI/styling
* **Prisma + PostgreSQL (Neon)** – database
* **QR Code Library** – for generating QR codes
* *(Optional for demo)* Three.js + React-Three-Fiber for simple 3D model placeholder

---

## Project Structure

```
/src
  /app
    /dashboard
      page.tsx        # Admin dashboard
      menu-form.tsx   # Create menu
      item-form.tsx   # Add menu items
    /menu/[menuId]
      page.tsx        # Guest menu view
      cart.tsx        # Guest cart + bill
  /components
    ui/               # Shadcn components
    forms/            # Forms for menu & items
  /lib
    prisma.ts         # Prisma client
    qr.ts             # QR code generator
  /db
    schema.prisma     # Prototype schema
```

---

## Database Schema (Prototype)

### Menu

* `id`
* `title`
* `description`
* `qrCodeUrl`
* `createdAt`

### MenuItem

* `id`
* `menuId`
* `name`
* `imageUrl`
* `description`
* `category`
* `price`

### Order

* `id`
* `menuId`
* `items` (relation to OrderItem)
* `totalAmount`
* `createdAt`

### OrderItem

* `id`
* `orderId`
* `menuItemId`
* `quantity`
* `price`

---

## Prototype Flow

### Admin Flow

1. Access dashboard.
2. Create menu + add items.
3. Get QR code → share with guests.

### Guest Flow

1. Scan QR → view menu.
2. Browse menu + add items to cart.
3. Checkout → bill displayed.

---

## Next Steps for Prototype

1. Scaffold Next.js project with Tailwind + Shadcn.
2. Setup Prisma + PostgreSQL schema (Menu, MenuItem, Order, OrderItem).
3. Build admin dashboard for creating menus + items.
4. Implement QR code generation.
5. Build guest-facing menu page with cart + bill display.
6. (Optional) Add placeholder 3D model rendering for a menu item.

---
