# Tiya Cafe POS & Dashboard Case Study & Reference

This case study provides a complete breakdown of the Tiya Cafe Dashboard application. It is designed to serve as a comprehensive reference guide for building a similar platform with customized modifications.

---

## 1. Overview & High-Level Architecture

Tiya is a cloud-based restaurant POS (Point of Sale), table management, and digital menu platform. The system operates around the following core modules:
1. **Menu Management**: Categories, individual items, combos, and QR-based digital menus.
2. **Floor & Table Management**: Defining dining areas, table layouts, and real-time status tracking.
3. **Order & Billing Flow**: Order capture, Kitchen/Bar ticket dispatch (KOT/BOT), status updates, billing estimation, and payment processing.
4. **Supply Chain & Operations**: Deliveries, recipes, stock management, vendor logs, expenses, and savings ledgers.
5. **Business Administration**: Customer profiles, loyalty schemes, staff shift/role management, multi-branch control, support ticket logging, printer configurations, and operational audit reports.

### Complete Sidebar Navigation Map

```
📊 Dashboard (Home / Analytics)
│   └── /dashboard/cafe
│
🍽️ Menu & Category
│   ├── Category List       → /dashboard/categories
│   ├── Menu Items          → /dashboard/menus
│   ├── Menus (Preview)     → /dashboard/menu
│   └── Combo               → /dashboard/combo
│
🪑 Manage Tables
│   ├── Manage Areas        → /dashboard/areas
│   └── Tables (Live View)  → /dashboard/tables
│
📋 Order Management
│   ├── Order List          → /dashboard/order?tab=1
│   └── Create Order        → /dashboard/order/create
│
🛵 Delivery Management
│   ├── Delivery Orders     → /dashboard/deliveries
│   └── Create Delivery     → /dashboard/deliveries/create
│
🍳 Recipe Management
│   └── Recipe List         → /dashboard/recipes
│
📦 Stock Management
│   ├── Inventory Stock     → /dashboard/stock
│   ├── Add Stock           → /dashboard/stock/add
│   ├── Assigned Stock List → /dashboard/assigned-stock
│   └── Assign Stock        → /dashboard/assign-stock
│
🤝 Vendors
│   └── Vendors List        → /dashboard/vendors
│
💸 Expense
│   ├── Create Expense      → /dashboard/expenses/create
│   ├── Expense Lists       → /dashboard/expenses
│   └── Expense Payment     → /dashboard/expenses/payments
│
🏦 Savings
│   ├── Institution         → /dashboard/savings/institutions
│   └── Transactions        → /dashboard/savings/transactions
│
👥 Customers & Creditors
│   ├── Customer List       → /dashboard/customers
│   ├── Creditors           → /dashboard/creditors
│   ├── Order History       → /dashboard/order-history
│   └── Credit History      → /dashboard/credit-history
│
🏷️ Discount & Offers
│   └── Discounts           → /dashboard/discounts
│
👨‍💼 Staff Management
│   ├── Staff List          → /dashboard/staff
│   └── Attendance          → /dashboard/staff-attendance
│
🏪 Branches (Multi-outlet)
│   └── Branches List       → /dashboard/branches
│
🎫 Issues (Support Tickets)
│   ├── Create Issue        → /dashboard/issues/create
│   └── My Issues           → /dashboard/issues
│
📖 Cafe Transactions (Ledger)
│   └── Transactions        → /dashboard/transactions
│
📈 Cafe Reports
│   ├── Sales & Payment     → /dashboard/reports/sales
│   ├── Stock & Inventory   → /dashboard/reports/stock
│   ├── Expense Report      → /dashboard/reports/expenses
│   └── Sales vs. Expense   → /dashboard/reports/sales-vs-expenses
│
⚙️ Settings & Configurations
│   ├── Cafe Account        → /dashboard/settings/cafe
│   ├── Loyalty Program     → /dashboard/settings/loyalty
│   ├── Payment QR          → /dashboard/settings/payment-qr
│   ├── Printer Setup       → /dashboard/settings/printer
│   ├── IP Setup            → /dashboard/settings/ip-printer
│   ├── Purchase History    → /dashboard/settings/purchases
│   ├── Order Types         → /dashboard/settings/order-types
│   ├── Additional (Tax)    → /dashboard/settings/tax
│   ├── Unit Details        → /dashboard/settings/units
│   ├── Upgrade Plan        → /dashboard/settings/upgrade
│   └── Delete Cafe         → /dashboard/settings/delete
│
🖥️ POS Mode (Separate Fullscreen View)
    └── /pos-mode/tables
```

### Table State Machine
The system relies on a real-time state machine for tables to coordinate actions between waitstaff, kitchen, and cashier:

```mermaid
stateDiagram-v2
    [*] --> Empty : Default state (Grey)
    Empty --> Unserved : Order placed / Confirmed (Pink)
    Unserved --> PartiallyServed : Some items served (Yellow)
    Unserved --> Served : All items served (Green)
    PartiallyServed --> Served : Remaining items served (Green)
    Served --> Billing : "Get Bill" requested (Billing Toggle Active)
    Billing --> Empty : Bill settled / Table cleared (Grey)
```

---

## 2. Feature-by-Feature Reference & Screenshots

Below is a detailed breakdown of the features, forms, layouts, and screenshots.

### Feature 2.1: Analytics Dashboard (Home Page)
The homepage serves as a hub for daily operations, tracking financial performance, recent orders, and quick configuration prompts.
- **KPI Cards Carousel**:
  - **Total Sales**: Displays current daily sales.
  - **Credit Settled / Credit Remaining**: Tracks credit transactions and creditors.
  - **Payment Breakdown**: Comparison of Cash payments vs. Online/Digital payments.
  - **Average Ticket Value**: Tracks Average Sales per Order and Total Order Count.
- **Recent Activity Tables**:
  - **Recent Orders**: Lists order status, table, customer name, and payment status.
  - **Creditors**: Quick list of clients with outstanding tabs.
- **Education Section**: Embedded YouTube tutorials for mobile setup.

![Dashboard Home Page](./screenshots/dashboard_home_1783046438897.png)

---

### Feature 2.2: Menu & Category Management
Menu structure is two-tiered: **Categories** contain **Menu Items**. Additionally, **Combo** items allow bundle definitions.

#### A. Categories View & Creator
Categories are represented by visual cards in a grid.
- **BOT Toggle**: Enables "Beverage/Bar Order Ticket" generation for items in this category.
- **Inline Creator**: When adding a category, the system allows adding initial menu items directly within the category modal, boosting onboarding speed.

![Categories Grid](./screenshots/dashboard_categories_1783046490880.png)

![Add Category Modal](./screenshots/add_category_modal_1783046533084.png)

#### B. Menu Items & Public QR Menu
Menu items are managed in a tabular format. The system also supports generating a public digital menu link and a corresponding QR code for customers to scan at tables.
- **BOT Toggle**: Present on individual menu items to route tickets.

![Menu Items Table](./screenshots/dashboard_menu_items_1783046634504.png)

![Add Item Modal](./screenshots/add_menu_item_modal_1783046661631.png)

![Public Menu Preview](./screenshots/dashboard_menus_preview_1783046716744.png)

![Generate Menu QR](./screenshots/menu_qr_modal_1783046749363.png)

#### C. Combo/Bundle Deals
Allows managers to bundle multiple items into a single priced package.
- **Drag-and-Drop Reordering**: Rearrange items within the bundle modal.
- **Required Fields**: Combo Name, Combo Price, Combo Image.

![Combo List](./screenshots/dashboard_combo_items_1783046805866.png)

![Add Combo Modal](./screenshots/add_combo_modal_1783046836168.png)

---

### Feature 2.3: Floor & Table Management
Dining spaces are organized into **Dining Areas** (e.g. Indoor, Outdoor, Rooftop) and **Tables**.

#### A. Dining Areas (Floor Plans)
Areas list shows the serial number, area name, number of tables, and management actions. Adding an area includes a quick-add form for tables inside that area.

![Areas List](./screenshots/dashboard_areas_list_1783046914929.png)

![Add Area & Tables Modal](./screenshots/add_area_modal_1783046945385.png)

#### B. Tables Overview & Table Merging
Waitstaff see a live visual overview of tables colored by status.
- **Merge Feature**: In high-occupancy situations, a manager can select multiple tables and click **Proceed** to place a single, consolidated order for them.

![Tables Live Grid](./screenshots/dashboard_tables_view_1783047002612.png)

![Merge Toggle Mode](./screenshots/tables_merge_state_1783047029766.png)

![Selecting Tables to Merge](./screenshots/tables_two_selected_1783047077791.png)

---

### Feature 2.4: Ordering & POS Flow
The ordering system matches standard POS layout paradigms.
- **POS Create Order Screen**:
  - **Category Tabs**: Top horizontal scrolling bar to quickly filter items.
  - **Item Grid**: Searchable item list with images and pricing.
  - **Order Cart Sidebar (Right)**: Shows current table details, item list, modifiers, specific notes, and subtotal.
- **Order State Updating**:
  - Waitstaff can view active orders in the **Order List**.
  - Clicking an order opens a sidebar showing item-wise states. Items can be marked as **Served** individually.

![POS Screen (Merged Tables)](./screenshots/create_order_merged_tables_1783047114213.png)

![POS Screen (Standard Table)](./screenshots/create_order_blank_1783047296063.png)

![Order List](./screenshots/order_list_empty_1783047199113.png)

![Order Item serving update](./screenshots/order_list_with_details_1783047458101.png)

---

### Feature 2.5: Billing & Settlement
Once dining is complete, waitstaff trigger the billing step:
1. Click **Get Bill** in the order details sidebar.
2. A modal displays a **Bill Estimation Receipt** layout including:
   - Cafe Logo & Header information.
   - Table ID & Order ID.
   - Subtotal, Service Charge, and Total Payable.
3. Cashier presents the **Payment QR Code Modal** (if paying online) or records cash settlement.

![Bill Estimation Receipt](./screenshots/bill_estimation_preview_1783047529003.png)

![Payment Settlement QR](./screenshots/payment_qr_code_modal_1783047226149.png)

---

### Feature 2.6: Standalone POS Mode
For high-volume operations, the cashier or manager can toggle into a dedicated full-screen POS mode.
- **Layout Tabs**:
  - **Tables Grid**: Standard visual floor plan for order management.
  - **Orders Tab**: Quick overview of all current active orders.
  - **Deliveries Tab**: Handles takeaway, packing, and third-party delivery dispatch tracking.
- **Header Actions**: Quick access to exit POS Mode (protected by a confirmation modal to prevent accidental exits).

![POS Mode Main](./screenshots/dashboard_pos_mode_1783048012121.png)

![POS Mode Orders Tab](./screenshots/pos_mode_orders_tab_1783048023554.png)

![POS Mode Deliveries Tab](./screenshots/pos_mode_deliveries_tab_1783048035569.png)

---

### Feature 2.7: POS Mode — Table Detail & In-Table Ordering
When a table is occupied in POS Mode, clicking on it opens a compact right-side order panel without leaving the floor plan view.
- **Table Card**: Displays table name, table status badge, and order summary at a glance.
- **Inline Order Detail Panel**:
  - Lists all ordered items with quantities and per-item status.
  - Individual **Serve** / **Served** toggle per item.
  - **Get Bill** button triggers the estimation receipt modal from within POS mode.
  - **Cancel Bill** returns to the active order state.
- **Table Legend Notation** (bottom of POS tables screen):
  - 🔘 **Empty** (Grey) — available table
  - 🔴 **Unserved** (Pink/Red) — order placed, items not yet served
  - 🟡 **Partially Served** (Yellow) — some items served
  - 🟢 **Served** (Green) — all items served, ready to bill
  - **Billing** (accent color toggle) — bill requested, awaiting payment

![POS Tables Full Layout](./screenshots/pos_tables_page_1783051793652.png)

![POS Table 2 Detail Panel (Active Order)](./screenshots/pos_table_2_clicked_1783051817179.png)

![Get Bill in POS Mode](./screenshots/get_bill_clicked_1783051839565.png)

![Exit POS Mode Confirmation](./screenshots/back_to_dashboard_from_pos_1783051892426.png)

![After Exiting POS Mode - Back to Dashboard](./screenshots/exited_pos_mode_1783051915716.png)

---

### Feature 2.8: Delivery Management
Manages outgoing food delivery orders, separating dispatch logistics from in-house POS orders.
- **Delivery Orders List**: Displays SN, Order ID, Customer Details (Name, Address, Phone), Order Total, Payment Status, Delivery Partner, and Actions.
- **Create Delivery Order Form**:
  - Customer Details: Name, Contact, Address, Delivery Cost.
  - Selected Items & Quantity.
  - Payment Details: Discount, Tax Rate, Payment Method.

![Delivery Orders List](./screenshots/feature_delivery_list_1783085095649.png)

![Create Delivery Order Form](./screenshots/feature_add_delivery_1783085107843.png)

---

### Feature 2.9: Recipe Management
Allows managers to document the precise ingredients list and portion requirements for each menu item to track stock decrement and margins.
- **Recipe List View**: Tabular list displaying Category, Item Name, and Actions.
- **Create/Add Recipe Form**:
  - Select Menu Item.
  - Add Ingredients: Select Raw Material, specify Qty, specify Unit (e.g. g, ml, pcs).
  - Add multiple rows of ingredients.

![Recipe List](./screenshots/feature_recipe_list_1783085131010.png)

![Create Recipe Form](./screenshots/feature_add_recipe_1783085145902.png)

---

### Feature 2.10: Stock & Inventory Management
Keeps a live check of ingredients, packaging, and raw materials stored in the cafe kitchen/pantry.
- **Inventory Stock List**: Lists item Name, Unit type, and current Available Stock count.
- **Add Stock Form (Batch)**:
  - Select Raw Material, specify Quantity Added, Expiry Date (Optional), and Unit Cost.
- **Assigned Stock & Assign Stock Form**:
  - Allows transferring/assigning specific stock items to waiters or branch departments.
  - Assign Form fields: Select Waiter/User, Raw Material item, Quantity, and Description/Notes.

![Stock List](./screenshots/feature_stock_list_1783085178379.png)

![Quick Add Item Modal](./screenshots/feature_add_stock_modal_1783085192900.png)

![Add Stock Batch Form](./screenshots/feature_add_stock_batch_1783085222137.png)

![Assigned Stock List](./screenshots/feature_assign_stock_list_1783085238180.png)

![Assign Stock Form](./screenshots/feature_assign_stock_form_1783085253541.png)

---

### Feature 2.11: Vendor Management
Tracks contact and status details of suppliers delivering ingredients and raw goods.
- **Vendors List**: Lists supplier Serial Number, Vendor Name, Contact Number, Address, Status (Active/Inactive), and Actions.
- **Add Vendor Modal**: Form fields include Vendor Name, Contact Number, Address, and Email Address.

![Vendors List](./screenshots/feature_vendors_list_1783085280583.png)

![Add Vendor Modal](./screenshots/feature_add_vendor_modal_1783085300450.png)

---

### Feature 2.12: Expense Tracking
Tracks all operational costs, ingredient purchases, and overheads outside of standard menu transactions.
- **Create Expense Form**: Fields include Select Category, Expense Name, Price/Amount, Date, and Description.
- **Expense Lists Table**: Chronological table showing SN, Expense Name, Category, Date, Total Price, Paid Status (Paid/Unpaid), and Actions.
- **Expense Payment Log**: Ledger recording payments made towards settling vendor bills or utilities.

![Create Expense Form](./screenshots/feature_create_expense_1783085346253.png)

![Expense Lists Table](./screenshots/feature_expense_lists_1783085360217.png)

![Expense Payment Log](./screenshots/feature_expense_payment_1783085378323.png)

---

### Feature 2.13: Savings & Financial Accounts
A structured module for managing banking relations, financial institutions, deposits, and withdrawal accounts.
- **Institution List**: Lists SN, Institution Name, Address, Contact, Account Number, Initial Amount, and Actions. Includes a **+ Institution** modal.
- **Transactions List**: Logs cashbook savings activity, displaying SN, Institution, Type (Deposit/Withdrawal), Amount, Date, and Description.
- **Deposit & Withdrawal Modals**: Clear forms asking for Institution selection, Transaction Date, Amount, and Description.

![Institution List](./screenshots/feature_savings_institution_list_1783085419438.png)

![Add Institution Modal](./screenshots/feature_add_institution_modal_1783085438815.png)

![Savings Transactions List](./screenshots/feature_savings_transaction_list_1783085475653.png)

![Deposit Modal Form](./screenshots/feature_savings_deposit_modal_1783085514977.png)

![Withdrawal Modal Form](./screenshots/feature_savings_withdrawal_modal_1783085564536.png)

---

### Feature 2.14: Customer Management & Credits
Manages customer relationships, accounts, loyalty points, and outstanding credits.
- **Customer List & Profiles**: Table containing Customer Name, Contact Number, outstanding balance, and registration time. Includes an **Add Customer** modal for swift signups.
- **Creditor Tracking**: Focused ledger showing only customers with a non-zero credit balance, with direct payment settlement triggers.
- **Order & Credit History**: Displays a log of past settled orders and a ledger of credit transactions split into Credit History and Settled Orders.

![Customers List](./screenshots/dashboard_customers_list_1783048090969.png)

![Add Customer Modal](./screenshots/dashboard_add_customer_modal_1783048110004.png)

![Creditors List](./screenshots/dashboard_creditors_list_1783048164294.png)

![Order History](./screenshots/dashboard_order_history_empty_1783048180985.png)

![Credit Ledger History](./screenshots/dashboard_credit_history_1783048197893.png)

---

### Feature 2.15: Discounts, Offers & Promo Codes
Enables campaigns, loyalty promo codes, and special category price cuts.
- **Discounts List View**: Lists SN, Promo Code, Title, Discount Type (e.g. Percentage, Flat), Value, Status, and Actions.
- **Add Offer Modal**:
  - Promo Code (Text, required).
  - Promo Title (Text, required).
  - Discount Type (Dropdown: Flat / Percentage).
  - Discount Value (Number).
  - Expiry Date (Date).

![Offers List](./screenshots/feature_discount_offers_page_1783085799082.png)

![Add Offer Modal](./screenshots/feature_add_offer_modal_1783085818695.png)

---

### Feature 2.16: Staff Management & Attendance
Controls permissions and user accounts for employees operating terminals or tablets.
- **User Roles & Access Levels**: Available staff roles include:
  - `WAITER`, `CAFEMANAGER`, `CAFESUPERVISOR`, `CASHIER`, `KITCHENSTAFF`, `SERVER`, `ADMIN`
- **Attendance Log**: Simple timecard check-in tracking page to monitor active shifts.
- **Add Staff Creator**: Input employee Name, Phone, Role selection, and password credentials.

![Staff List](./screenshots/dashboard_staff_management_list_1783048343981.png)

![Add Staff Modal](./screenshots/dashboard_add_staff_modal_1783048282972.png)

![Attendance Log](./screenshots/dashboard_staff_attendance_list_1783048244262.png)

---

### Feature 2.17: Multi-branch / Franchise Management
Enables vendor administration across different geographical shop branches or franchises.
- **Branches List Table**: Lists SN, Branch Name, Contact Number, Address, and Actions.
- **Create Branch Modal**: Fields are Branch Name, Contact Number, Address, and Email Address.

![Branches List](./screenshots/feature_branches_page_1783085966146.png)

![Add Branch Modal](./screenshots/feature_new_branch_modal_1783085985277.png)

---

### Feature 2.18: Issue Tracking & Support Tickets
Allows POS operators to lodge bugs, system issues, or support tickets directly from the portal interface.
- **Create Support Ticket Form**: Input fields include Title, Description, Category, Priority, and Attachment (File).
- **My Issues List**: Tabular summary tracking the ticket progress state (Open, In Progress, Resolved).

![Create Support Ticket](./screenshots/feature_create_issue_page_1783086050309.png)

![My Issues List](./screenshots/feature_my_issues_page_1783086070821.png)

---

### Feature 2.19: Cafe Transactions Ledger / Cash Book
A daily cash book ledger audit log recording overall cash transactions, audits, and credit adjustments.
- **Transactions Table**: Columns show SN, Date, Transaction Details, Type, Reference ID, Amount, and Balance.

![Transactions Ledger](./screenshots/feature_cafe_transactions_page_1783086114432.png)

---

### Feature 2.20: Printer Setup & KOT Routing
Configures receipt printer parameters and network configurations for KOT/BOT ticket printing.
- **Printer Setup Page**: Allows naming the printer, choosing connection type (USB, Wi-Fi, Ethernet), paper width, and routing rules.
- **Network IP Printer Setup Tab**: Configures IP addresses, port settings, and protocol tags.

![Printer Setup](./screenshots/feature_printer_setup_page_1783086173751.png)

![IP Config Network Printer](./screenshots/feature_ip_setup_tab_1783086194256.png)

---

### Feature 2.21: Global Header — Top-Right Quick Access Bar
The top-right area of the dashboard header contains a persistent set of quick-access controls visible on every dashboard page. These are:
- **Grid/QR Icon**: Opens the Menu QR code modal instantly.
- **Cloche/Dome Icon**: Quick-links to the Visual Menu Preview page (`/dashboard/menu`).
- **Piggy Bank Icon**: Quick-links to the Customers & Creditors section.
- **Headset Icon**: Opens the **Help & Support** center.
- **Notification Bell**: Displays a dropdown list of system alerts with badge count.
- **Profile Avatar**: Opens a dropdown showing name/role, active cafe, and Logout.
- **Trial/Days Indicator**: Shows remaining trial days. Clicking opens the **Upgrade Plan** modal.
- **POS Mode Button**: Enters the dedicated full-screen POS interface.

![Grid Icon → QR Modal](./screenshots/dashboard_grid_icon_clicked_1783051622563.png)

![Cloche Icon → Menu Page](./screenshots/dashboard_menu_page_1783051651812.png)

![Piggy Bank → Creditors](./screenshots/dashboard_piggy_bank_clicked_1783051665030.png)

![Headset → Support Hub](./screenshots/dashboard_headset_clicked_1783051678324.png)

![Notification Dropdown](./screenshots/dashboard_notification_clicked_1783051690345.png)

![Profile Dropdown](./screenshots/dashboard_profile_dropdown_opened_1783051728522.png)

![Trial Clicked → Upgrade](./screenshots/dashboard_trial_clicked_1783051744094.png)

---

### Feature 2.22: Cafe Settings & Configurations
Provides a comprehensive set of tabs for vendor administration:
- **Cafe Account Settings**: Basic shop information, description, address, and logo.
- **Loyalty Program**: Configuration of points system (e.g. points value, conversion ratios).
- **Payment QR Configuration**: Standardizes vendor QR code images displayed to customers at checkout.
- **Order Type Settings**: Toggle between Dine-in, Takeaway, or Delivery configurations.
- **Additional Settings**: VAT rates, service charge percentages, auto-billing options, and currency labels.
- **Unit Details**: Configure measurement units (e.g. kg, ml, pcs) for inventory stock.
- **Purchase History**: Logs cafe subscription and billing transaction history.

![Cafe Account Settings](./screenshots/feature_cafe_settings_page_1783086239042.png)

![Loyalty settings](./screenshots/feature_loyalty_tab_1783086262428.png)

![Payment QR setup](./screenshots/feature_payment_qr_tab_1783086284672.png)

![Upgrade Plan pricing](./screenshots/feature_upgrade_plan_tab_1783086314158.png)

![Order Type configurations](./screenshots/feature_order_type_tab_1783086371812.png)

![Tax / VAT settings](./screenshots/feature_additional_settings_tab_1783086399816.png)

![Unit details settings](./screenshots/feature_unit_details_tab_1783086431167.png)

![Subscription purchases list](./screenshots/feature_purchase_history_page_1783086215409.png)

![Delete Cafe settings](./screenshots/feature_delete_cafe_tab_1783086495426.png)

---

### Feature 2.23: Operations Reports & Analytics
A comprehensive suite of operational reports grouped under four main categories:
1. **Sales & Payment Report**:
   - **Sales Report**: Timeline graph and daily transaction log.
   - **Top Selling Items**: Visual chart of popular products by quantity and revenue.
   - **Payment Report**: Breakdowns of payment gateways/mediums.
   - **Sales Summary**: Consolidated reports for tax filing.
2. **Stock & Inventory**:
   - **Stock Report**: Live count of menu items/ingredients.
   - **Inventory Report**: Historical stock log.
3. **Expense Report**: Tracks operational costs, ingredient purchases, and utility overheads.
4. **Sales vs. Expense**: Comparative chart assessing profitability and cash flow.

![Sales Report Graph](./screenshots/feature_sales_report_tab_1783085617251.png)

![Top Selling Items Report](./screenshots/feature_top_selling_items_tab_1783085638180.png)

![Payment Breakdown Report](./screenshots/feature_payment_report_tab_1783085658562.png)

![Sales Summary report](./screenshots/feature_sales_summary_tab_1783085678473.png)

![Stock Inventory Count](./screenshots/feature_stock_report_tab_1783085700039.png)

![Inventory stock log](./screenshots/feature_inventory_report_tab_1783085720430.png)

![Expense Chart report](./screenshots/feature_expense_report_page_1783085740766.png)

![Profitability Sales vs Expense](./screenshots/feature_sales_vs_expense_page_1783085765467.png)

---

## 3. Recommended Design System & Aesthetics

When building the custom version, we should aim for high visual excellence using modern web standards.

### Color Palette Suggestions (Sleek Dark Mode)
Instead of generic colors, implement a balanced, professional palette:

| Palette Token | Color Name | HEX Code | Purpose |
| --- | --- | --- | --- |
| Primary Accent | Royal Indigo | `#5C6BC0` | Active buttons, primary links, highlighted states |
| Success Accent | Emerald Mint | `#2EC4B6` | Table state: Served, Paid, Add actions |
| Alert Accent | Sunset coral | `#FF9F1C` | Table state: Unserved, Billing |
| Dark Background | Deep Obsidian | `#0B0C10` | Main application background |
| Surface Background | Dark Slate | `#1F2833` | Cards, modals, sidebars |
| Text Primary | Off-White | `#F5F6F8` | Clear reading |
| Text Secondary | Slate Grey | `#8B95A5` | Metadata, counts, placeholder texts |

### Key Layout Considerations
- **Responsive Layout**: Sidebar collapses into a hamburger icon on tablet/mobile screens.
- **POS Screen split-panel**: Keep the Category filter stick-positioned at the top to optimize vertical space on smaller tablets/POS terminals.
- **Glassmorphic Modals**: CSS styling for modals should use `backdrop-filter: blur(10px)` with semi-transparent background colors to look premium.

---

## 4. Proposed Modification Plan for Custom Build

Based on our analysis of Tiya, here are some recommended modifications to add value to our custom version:

> [!TIP]
> **Suggested Modification 1: Split Bill Calculator**
> Introduce a split-billing modal on checkout, allowing customers or cashiers to split the total equally or item-wise (e.g. splitting Table 1 & Table 2 orders differently).

> [!TIP]
> **Suggested Modification 2: Offline-First Capability (Service Worker)**
> Implement localized localstorage/indexedDB cache for POS order creation. This prevents waitstaff from losing orders if the restaurant Wi-Fi momentarily drops.

> [!WARNING]
> **Suggested Modification 3: Custom QR Styling**
> Allow cafes to customize the generated public menu QR codes (e.g. adding their own logo in the center, choosing colors) before downloading and printing.
