# Architecture Documentation

This document explains how the Budget Tracker application is structured and organized.

## 📐 System Overview

Budget Tracker is a client-side web application built with React 18, using vanilla JavaScript (via Babel transpilation) and Tailwind CSS for styling. All data is stored locally in the browser's localStorage.

### Technology Stack
```
┌─────────────────────────────────────┐
│        User Interface (Browser)      │
├─────────────────────────────────────┤
│  React 18 (via CDN)                 │
│  Tailwind CSS (via CDN)             │
│  Babel Standalone (via CDN)         │
├─────────────────────────────────────┤
│  Application Code (ES6 JavaScript)  │
├─────────────────────────────────────┤
│  localStorage (Browser API)         │
└─────────────────────────────────────┘
```

---

## 📁 File Structure
```
budget-tracker/
│
├── index.html                 # Entry point, loads all scripts
│
└── js/
    ├── icons.js              # SVG icon components (7 icons)
    ├── utils.js              # Utilities and shared components
    ├── modals.js             # Modal components for add/edit operations
    ├── pages.js              # Main page/tab components
    ├── dashboard.js          # Dashboard component
    └── main.js               # Main app component and initialization
```

### Load Order

Files must be loaded in this specific order (defined in index.html):

1. **icons.js** - Icon components used throughout the app
2. **utils.js** - Helper functions and shared components
3. **modals.js** - Modal components (depend on utils)
4. **pages.js** - Page components (depend on utils and modals)
5. **dashboard.js** - Dashboard (depends on utils)
6. **main.js** - Main app (depends on all above)

---

## 🏗️ Component Architecture

### Component Hierarchy
```
BudgetTracker (main.js)
├── Header (inline)
├── TabNavigation (inline)
└── ContentArea
    ├── Dashboard (dashboard.js)
    │   ├── SummaryCards
    │   ├── RecurringPaymentsSummary
    │   ├── UpcomingPayments
    │   ├── SpendingByCategory
    │   ├── SavingsTracker (utils.js)
    │   ├── BudgetOverview
    │   └── DataManagement
    │
    ├── Transactions (pages.js)
    │   ├── SearchBar
    │   ├── FilterButtons
    │   └── TransactionList
    │
    ├── Subscriptions (pages.js)
    │   ├── SubscriptionList
    │   └── SavingsActions (utils.js)
    │
    ├── Bills (pages.js)
    │   ├── BillList
    │   └── SavingsActions (utils.js)
    │
    └── Budgets (pages.js)
        └── BudgetList

Modals (modals.js)
├── AddTransactionModal
├── AddSubscriptionModal
├── AddBillModal
├── AddBudgetModal
├── EditSubscriptionModal
└── EditBillModal
```

---

## 🔄 Data Flow

### State Management

The application uses React's built-in state management (useState) with no external libraries.
```
┌──────────────────────────────────────────┐
│        BudgetTracker Component           │
│  (main.js - Root Component)              │
│                                          │
│  State:                                  │
│  • transactions: []                      │
│  • subscriptions: []                     │
│  • bills: []                             │
│  • budgets: []                           │
│  • savingsBalance: 0                     │
│  • activeTab: 'dashboard'                │
│  • modal states (show/hide)              │
│  • editing states                        │
└──────────────────────────────────────────┘
          │
          ├─ Props passed down ─┐
          │                     │
          ▼                     ▼
    Child Components      Helper Functions
    (display data)        (transform data)
```

### Data Persistence Flow
```
User Action
    │
    ▼
Component Handler
    │
    ▼
State Update (useState)
    │
    ▼
useEffect Trigger
    │
    ▼
localStorage.setItem()
    │
    ▼
Data Saved to Browser
```

### Data Loading Flow
```
App Initialization
    │
    ▼
useEffect (on mount)
    │
    ▼
localStorage.getItem()
    │
    ▼
JSON.parse()
    │
    ▼
setState() calls
    │
    ▼
Components Re-render
```

---

## 🗃️ Data Models

### Transaction
```javascript
{
  id: number,              // Timestamp-based unique ID
  type: 'income'|'expense', // Transaction type
  amount: string,          // Formatted to 2 decimals
  description: string,     // Transaction description
  category: string,        // Category name
  source: string,          // Payment source
  date: string            // ISO date string
}
```

### Subscription
```javascript
{
  id: number,                    // Timestamp-based unique ID
  name: string,                  // Subscription name
  amount: string,                // Formatted to 2 decimals
  source: string,                // Payment source
  frequency: string,             // 'Monthly'|'Quarterly'|'Semi-Annual'|'Annual'
  category: string,              // Category name
  nextPayment: string,           // ISO date string
  flaggedForCancellation: boolean, // Flag status
  savingsLog?: Array<{           // Only for non-monthly
    date: string,                // ISO date string
    amount: number              // Amount saved
  }>
}
```

### Bill
```javascript
{
  id: number,                  // Timestamp-based unique ID
  name: string,                // Bill name
  amount: string,              // Formatted to 2 decimals
  source: string,              // Payment source
  frequency: string,           // 'Monthly'|'Quarterly'|'Semi-Annual'|'Annual'
  category: string,            // Category name
  nextPayment: string,         // ISO date string
  flaggedForReview: boolean,   // Flag status
  savingsLog?: Array<{         // Only for non-monthly
    date: string,              // ISO date string
    amount: number            // Amount saved
  }>
}
```

### Budget
```javascript
{
  id: number,        // Timestamp-based unique ID
  category: string,  // Category name
  limit: string     // Formatted to 2 decimals
}
```

### Saved Data Structure (localStorage)
```javascript
{
  transactions: Transaction[],
  subscriptions: Subscription[],
  bills: Bill[],
  budgets: Budget[],
  savingsBalance: number,
  exportDate?: string  // Only in exported files
}
```

---

## 🔧 Key Functions

### Helper Functions (utils.js)

#### `getMonthlyAmount(amount, frequency)`
Converts any frequency amount to monthly equivalent.
```javascript
// Frequency divisors
Monthly: 1
Quarterly: 3
Semi-Annual: 6
Annual: 12
```

#### `getSavedAmount(item)`
Calculates total saved from savings log.
```javascript
Returns: sum of all savingsLog entries
```

### Main App Functions (main.js)

#### CRUD Operations
- `addTransaction()`, `addSubscription()`, `addBill()`, `addBudget()`
- `updateSubscription()`, `updateBill()`
- `deleteTransaction()`, `deleteSubscription()`, `deleteBill()`

#### State Toggles
- `toggleSubscriptionFlag()` - Toggle cancellation flag
- `toggleBillFlag()` - Toggle review flag

#### Savings Management
- `addSavingsPayment()` - Add payment to savings log
- `adjustSavings()` - Manually set total saved

#### Data Management
- `exportData()` - Create JSON backup file
- `importData()` - Load data from JSON file

#### Calculations
- `calculateTotals()` - Income, expenses, balance
- `getCategorySpending()` - Spending for specific category
- `getAllCategorySpending()` - All categories with transactions + recurring

---

## 🎨 Styling Architecture

### Tailwind CSS Utility Classes

The app uses Tailwind's utility-first approach with no custom CSS.

#### Color Palette
```css
Primary Blue:   bg-blue-600, text-blue-600, border-blue-600
Success Green:  bg-green-600, text-green-600
Danger Red:     bg-red-600, text-red-600
Warning Orange: bg-orange-600, text-orange-600
Warning Yellow: bg-yellow-600, text-yellow-600
Gray Scale:     bg-gray-50 through bg-gray-600
```

#### Common Patterns
```css
Card:           bg-white p-6 rounded-lg shadow
Button:         px-4 py-2 rounded hover:bg-{color}-700
Input:          px-3 py-2 border rounded
Modal:          fixed inset-0 bg-black bg-opacity-50 z-50
Badge:          px-2 py-1 text-xs rounded
```

---

## 🔐 Security Considerations

### Current Security Model

**Client-Side Only**
- No server communication
- No authentication system
- No API calls
- Data never leaves the device

**Risks**
- Anyone with device access can view data
- No encryption on localStorage
- No password protection

**Mitigations**
- Rely on device/browser security
- User should lock their device
- Use device encryption
- Clear browser data when selling device

### Future Security Enhancements (v4.0+)
- Optional cloud sync with authentication
- End-to-end encryption
- Biometric lock option (PWA)
- Session timeout

---

## 📊 Performance Considerations

### Current Performance

**Strengths**
- No network requests (instant load)
- All rendering on client
- localStorage is fast for small datasets
- React virtual DOM efficient

**Limitations**
- Large datasets (10,000+ transactions) may slow down
- No pagination currently
- All data loaded at once
- No lazy loading

### Optimization Strategies (Future)
- Pagination for transaction lists
- Virtual scrolling for large lists
- Debounced search
- Memoization of expensive calculations
- Code splitting when migrating to build system

---

## 🧪 Testing Strategy

### Current State
- Manual testing only
- No automated tests

### Future Testing (Recommended)
```
Unit Tests:
- Helper functions (getMonthlyAmount, getSavedAmount)
- Calculation functions
- Data transformations

Integration Tests:
- CRUD operations
- State management
- localStorage persistence

End-to-End Tests:
- Complete user workflows
- Export/import functionality
- Cross-browser compatibility
```

---

## 🚀 Deployment

### Current Deployment: GitHub Pages

**Process:**
1. Push code to GitHub repository
2. Enable Pages in Settings
3. Select branch (main/master)
4. Site auto-deploys on push

**Build Process:** None (vanilla files served directly)

**CDN Dependencies:**
- React 18: `unpkg.com/react@18`
- ReactDOM 18: `unpkg.com/react-dom@18`
- Babel Standalone: `unpkg.com/@babel/standalone`
- Tailwind CSS: `cdn.tailwindcss.com`

### Alternative Deployment Options
- Netlify (drag & drop)
- Vercel
- Any static hosting
- Local file system (file:///)

---

## 🔄 Version Control Strategy

### Current: GitHub

**Branch Strategy:**
- `main` - Production (deployed)
- Feature branches for major updates

**Commit Convention:**
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style/formatting
refactor: Code restructuring
test: Add tests
chore: Maintenance tasks
```

---

## 📝 Code Standards

### Naming Conventions
- **Components**: PascalCase (`BudgetTracker`, `AddTransactionModal`)
- **Functions**: camelCase (`getMonthlyAmount`, `calculateTotals`)
- **Variables**: camelCase (`savingsBalance`, `activeTab`)
- **Constants**: UPPER_SNAKE_CASE (if any)

### File Organization
- One primary export per file
- Related components grouped together
- Helper functions in utils.js
- Modals in separate file

### React Patterns
- Functional components only
- Hooks for state management
- Props drilling (no context needed yet)
- Controlled components for forms

---

## 🔮 Future Architecture Plans

### Version 4.0 - Major Refactor
- **Build System**: Vite or Create React App
- **Module System**: ES6 imports/exports
- **State Management**: Consider Redux or Zustand for complex state
- **Routing**: React Router for multi-page feel
- **TypeScript**: Add type safety
- **Testing**: Jest + React Testing Library
- **PWA**: Service workers, offline support
- **Backend** (Optional): Node.js + Express + MongoDB for cloud sync

---

**Last Updated**: 2025-10-19  
**Document Version**: 1.0  
**Maintained By**: Project Owner:Emma Rose
