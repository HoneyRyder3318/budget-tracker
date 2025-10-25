# Changelog

All notable changes to the Budget Tracker project will be documented in this file.

[3.2.0] - 2025-10-25

Added
- Flagged Subscription Reminder System**: Proactive cancellation management
  - Alert banner appears 7 days before payment date for flagged subscriptions
  - Three action buttons: "I cancelled it - delete", "Remind me again", "I'm keeping it - unflag"
  - "Remind me again" dismisses alert until next payment cycle
  - Dismissed reminders tracked per subscription to avoid repeated nagging
- Combined Upcoming Payments Section**: Unified view of all upcoming payments
  - Flagged subscriptions shown at top with action buttons
  - Regular upcoming payments (next 7 days) shown below for reference
  - Cleaner, more organized dashboard layout

Changed
- Tab order reordered: Dashboard, Subscriptions, Bills, Budgets, Transactions
- Upcoming Payments section now includes both alerts and informational upcoming payments
- Flagged subscriptions get visual priority in upcoming payments display

[3.1.2] - 2025-10-22
Added

Savings Tracker Redesign: Complete visual overhaul with thermometer progress indicator
Monthly Savings Targets: Whole month calculations that increase on the 1st of each month
Budget Tab Month Filtering: Budget tab now has month selector dropdown like Dashboard
Date Testing Controls: Developer tools for testing savings calculations on different dates
Affiliate Ad Space: Added placeholder banner in Savings Tracker for monetization

Fixed

Fixed Budget tab showing all-time spending instead of monthly spending
Fixed "Add to Savings" button character artifact
Fixed Target Savings calculation showing $0
Fixed thermometer not tracking Manual Balance correctly
Fixed character encoding issues (bullet points and emojis displaying as garbled text)

Changed

App title updated to "Privelly" in browser tab and header
Savings Tracker now prominently displays Manual Balance in purple box
Budget component completely rewritten with month filtering support
Savings targets now use cumulative monthly calculations instead of daily prorated amounts

 ## [3.1.1] - 2025-10-20

   ### Fixed
   - Fixed import data functionality - resolved "monthly.toFixed is not a function" error
   - getMonthlyAmount now correctly returns a number instead of a string

## [3.1.0] - 2025-10-20

### Added
- **Monthly Transaction Filtering**: View transactions by specific month with dropdown selector
- **Dashboard Month Filter**: Dashboard now defaults to current month with month selector dropdown
- **Monthly Totals**: Income, expenses, and balance calculated for selected month
- **Budget Edit & Delete**: Added edit and delete functionality for budgets with confirmation
- **Month-Filtered Analytics**: Category spending and budget progress now filter by selected month

### Changed
- Dashboard now shows current month by default instead of all-time totals
- All dashboard calculations (income, expenses, spending, budgets) now filter by selected month
- Month selector automatically includes current month even with no transactions

### Fixed
- Dashboard props updated to properly pass transactions data
- Month filtering now works correctly across all dashboard components

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
