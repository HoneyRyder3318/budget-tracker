# Budget Tracker

A comprehensive personal finance management web application built with React.

## 🌟 Features

### Core Functionality
- **Transactions**: Track income and expenses with categories and search
- **Subscriptions**: Manage recurring subscriptions with multiple frequencies (Monthly, Quarterly, Semi-Annual, Annual)
- **Bills**: Track recurring bills with the same frequency options
- **Budgets**: Set spending limits by category with visual progress tracking
- **Savings Tracker**: Automatically calculate monthly savings needed for non-monthly bills/subscriptions

### Key Features
- 📊 **Spending by Category Graph**: Visual breakdown of where your money goes
- 💰 **Savings Management**: Track progress toward non-monthly payments
- 🔔 **Upcoming Payments Alert**: See bills/subscriptions due in the next 7 days
- 📈 **Dashboard Overview**: Income, expenses, balance, and recurring payment summaries
- 💾 **Data Export/Import**: Backup and restore your financial data
- 🏷️ **Flag System**: Mark subscriptions for cancellation or bills for review
- ✏️ **Edit Functionality**: Update subscriptions and bills without losing savings history

## 🛠️ Tech Stack

- **Frontend**: React 18 (via CDN)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Custom SVG components (Lucide-inspired)
- **Storage**: Browser localStorage
- **Deployment**: GitHub Pages

## 📁 Project Structure
```
budget-tracker/
├── index.html              # Main HTML file (55 lines)
└── js/
    ├── icons.js           # SVG icon components
    ├── utils.js           # Helper functions + SavingsTracker component
    ├── modals.js          # All add/edit modal components
    ├── pages.js           # Main page components (Transactions, Subscriptions, Bills, Budgets)
    ├── dashboard.js       # Dashboard component with all summary views
    └── main.js            # Main BudgetTracker component and app initialization
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)

### Installation

1. Clone or fork this repository
2. No build process needed! Just open `index.html` in a browser or deploy to GitHub Pages

### Deployment to GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" section
3. Under "Source", select your main/master branch
4. Click Save
5. Your site will be live at `https://yourusername.github.io/repository-name/`

## 💾 Data Storage

**Important**: All data is stored in your browser's localStorage. This means:
- ✅ Data persists between sessions
- ✅ Fast and private (data never leaves your device)
- ⚠️ Clearing browser data will delete all information
- ⚠️ Data is device-specific (not synced across devices)

**Recommendation**: Use the Export feature regularly to backup your data!

## 🎯 How to Use

### Adding Transactions
1. Go to the "Transactions" tab
2. Click "Add Transaction"
3. Fill in the details (type, amount, category, source, date)
4. Click "Add"

### Managing Subscriptions/Bills
1. Navigate to "Subscriptions" or "Bills" tab
2. Click "Add Subscription" or "Add Bill"
3. Enter details including frequency
4. For non-monthly items, the app automatically:
   - Calculates monthly savings needed
   - Shows progress bars
   - Provides savings tracking tools

### Savings Tracker
- Appears on Dashboard for non-monthly subscriptions/bills
- Shows how much you should save each month
- Track payments with the "✓ Add to Savings" button
- Adjust totals if you get off track

### Setting Budgets
1. Go to "Budgets" tab
2. Click "Add Budget"
3. Select category and set monthly limit
4. Dashboard shows progress with color-coded bars

## 🔧 Customization

### Changing Colors
Edit the Tailwind classes in `index.html` or component files. Common colors:
- Primary: `bg-blue-600`, `text-blue-600`
- Success: `bg-green-600`, `text-green-600`
- Danger: `bg-red-600`, `text-red-600`
- Warning: `bg-orange-600`, `text-orange-600`

### Adding Categories
Edit the category arrays in:
- `modals.js` - `AddTransactionModal`, `AddSubscriptionModal`, `AddBillModal`
- Look for `const categories = [...]`

### Modifying Payment Frequencies
Edit the `frequencies` array in:
- `modals.js` - `AddSubscriptionModal`, `AddBillModal`, `EditSubscriptionModal`, `EditBillModal`
- `utils.js` - `getMonthlyAmount` function

## 📊 Categories

### Transaction Categories
- Groceries
- Dining Out
- Transportation
- Entertainment
- Utilities
- Healthcare
- Shopping
- Other

### Subscription Categories
- Entertainment
- Education
- Tools/Software
- Health/Fitness
- News/Media
- Gaming
- Other

### Bill Categories
- Housing
- Utilities
- Insurance
- Transportation
- Other

## 🐛 Known Issues

See [BUGS.md](BUGS.md) for current known issues.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 🔮 Future Enhancements

See [TODO.md](TODO.md) for planned features.

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Feel free to:
- Report bugs
- Suggest features
- Fork and customize for your own use

## 📄 License

This project is open source and available for personal use.

## 👤 Author

Created with assistance from Claude (Anthropic)

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first styling
- Lucide for icon inspiration

---

**Version**: 3.0  
**Last Updated**: October 2025  
**Status**: Active Development
