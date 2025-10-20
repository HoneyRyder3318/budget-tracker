# Changelog

All notable changes to the Budget Tracker project will be documented in this file.

## [3.0.0] - 2025-10-19

### Major Restructure
- **Split into Multiple Files**: Reorganized entire codebase from single HTML file into modular structure
  - `index.html` (55 lines - clean structure)
  - `js/icons.js` - All SVG icon components
  - `js/utils.js` - Helper functions and SavingsTracker
  - `js/modals.js` - All add/edit modal components
  - `js/pages.js` - Page components (Transactions, Subscriptions, Bills, Budgets)
  - `js/dashboard.js` - Dashboard component
  - `js/main.js` - Main app logic

### Benefits of Restructure
- Much easier to update individual components
- Cleaner, more maintainable code
- Simplified UI customization via small index.html
- Better organization for future development

## [2.0.0] - 2025-10-19

### Added
- **Payment Frequencies**: Support for Monthly, Quarterly, Semi-Annual, and Annual payments
- **Savings Tracker**: Automatic calculation and tracking of savings needed for non-monthly bills
  - Monthly breakdown calculations
  - Progress bars with color coding (green/yellow/red)
  - "Add to Savings" functionality with adjustable amounts
  - "Adjust Total" feature for correcting mistakes
  - Savings account balance tracking
- **Category System**: 
  - Subscription categories (Entertainment, Education, Tools/Software, Health/Fitness, News/Media, Gaming, Other)
  - Bill categories (Housing, Utilities, Insurance, Transportation, Other)
- **Spending by Category Graph**: Visual bar chart showing spending breakdown
  - Includes transactions, subscriptions (monthly breakdown), and bills (monthly breakdown)
  - Percentage calculations
  - Total monthly spending summary
- **Edit Functionality**: 
  - Edit existing subscriptions
  - Edit existing bills
  - Preserves savings history when editing

### Changed
- Dashboard now shows monthly breakdown for all recurring payments regardless of frequency
- Recurring Payments Summary includes total yearly cost
- Improved visual hierarchy with better card layouts

## [1.1.0] - 2025-10-18

### Added
- **Subscriptions Management**: Track recurring subscriptions
  - Name, amount, payment source, next payment date
  - Flag for cancellation feature
  - Monthly and yearly cost display
- **Bills Management**: Track recurring bills
  - Similar to subscriptions but with "Flag for Review" instead
  - Separate from subscriptions for better organization
- **Budgets**: Set spending limits by category
  - Visual progress bars
  - Color-coded warnings (green/orange/red)
  - Spending vs limit tracking
- **Dashboard Enhancements**:
  - Recurring Payments Summary (subscriptions + bills count and total)
  - Upcoming Payments alert (next 7 days)
  - Budget Overview section
- **Data Management**:
  - Export data to JSON file
  - Import data from JSON file
  - Backup and restore functionality

### Changed
- Improved navigation with sticky tab bar
- Better mobile responsiveness
- Enhanced visual design with shadows and rounded corners

## [1.0.0] - 2025-10-18

### Initial Release
- **Transaction Tracking**: 
  - Add income and expense transactions
  - Categorize transactions (Groceries, Dining Out, Transportation, Entertainment, Utilities, Healthcare, Shopping, Other)
  - Track payment sources (Checking Account, Credit Card, Savings, Cash, Other)
  - Date tracking
- **Dashboard**:
  - Total income display
  - Total expenses display
  - Current balance calculation
  - Summary cards with icons
- **Transaction Management**:
  - Search/filter transactions
  - Filter by type (All, Income, Expense)
  - Sort by date (newest first)
  - Delete transactions
- **Data Persistence**: 
  - localStorage integration
  - Data survives browser refresh
- **Responsive Design**: 
  - Mobile-friendly interface
  - Tailwind CSS styling
  - Clean, modern UI

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0) - Incompatible changes or major restructures
- **MINOR** version (0.X.0) - New features, backwards compatible
- **PATCH** version (0.0.X) - Bug fixes, backwards compatible

## Categories for Changes
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
