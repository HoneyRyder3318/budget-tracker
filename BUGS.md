# Known Bugs & Issues

This file tracks known bugs, issues, and limitations in the Budget Tracker application.

## 🐛 Active Bugs

### Critical
*None currently identified*

### Major
*None currently identified*

### Minor
*None currently identified*

---

## ⚠️ Known Limitations

### Data Storage
- **localStorage Only**: Data is stored locally in browser
  - **Impact**: Data doesn't sync across devices
  - **Workaround**: Use Export/Import feature to transfer data
  - **Future Fix**: Planned for v4.0 with cloud sync option

- **Browser Data Clearing**: Clearing browser data deletes all app data
  - **Impact**: Can lose all financial records
  - **Workaround**: Regular exports as backups
  - **Future Fix**: Add auto-backup reminder

### Browser Compatibility
- **Older Browsers**: May not work on browsers older than 2020
  - **Impact**: Users with outdated browsers cannot use app
  - **Workaround**: Update to modern browser
  - **Status**: By design - using modern React 18

### Mobile Experience
- **Small Screen Tables**: Some tables may be cramped on very small screens
  - **Impact**: Harder to read on phones < 350px width
  - **Workaround**: Use landscape mode
  - **Future Fix**: Improve mobile layouts

### Functionality Gaps
- **No Budget Deletion**: Can add budgets but cannot delete them
  - **Impact**: Old budgets stay forever
  - **Workaround**: Set limit to $0.01 to effectively disable
  - **Future Fix**: Priority for v3.1

- **No Transaction Editing**: Can only delete and re-add transactions
  - **Impact**: Fixing typos requires re-entry
  - **Workaround**: Delete and re-create
  - **Future Fix**: Priority for v3.1

- **No Undo**: Deletions are permanent
  - **Impact**: Accidental deletions cannot be recovered
  - **Workaround**: Export data regularly
  - **Future Fix**: Add confirmation dialogs

### Data Validation
- **No Duplicate Detection**: Can create identical entries
  - **Impact**: May accidentally add same transaction twice
  - **Workaround**: Check before adding
  - **Future Fix**: Planned for v3.2

- **No Amount Limits**: Can enter unrealistic amounts
  - **Impact**: Typos like $10000 instead of $100.00
  - **Workaround**: Double-check before saving
  - **Future Fix**: Add validation warnings

### Savings Tracker
- **Manual Deduction**: Doesn't auto-deduct on due date
  - **Impact**: Must manually track when bills are paid
  - **Workaround**: Set calendar reminders
  - **Future Fix**: Planned for v3.1

- **No Payment History**: Savings log not visible to user
  - **Impact**: Can't see detailed history of contributions
  - **Workaround**: Use Export and view JSON
  - **Future Fix**: Add history view

---

## 🔧 Workarounds & Tips

### Prevent Data Loss
1. Export data weekly
2. Keep backups in multiple locations (email to yourself, save in cloud drive)
3. Don't clear browser data without exporting first
4. Test import/export functionality occasionally

### Dealing with Deleted Budgets
1. Export your data
2. Open the JSON file in a text editor
3. Find and remove the budget entry
4. Import the modified file

### Managing Large Data Sets
1. Archive old transactions (export, then delete from app)
2. Keep only current year's active data
3. Maintain separate backups for previous years

### Mobile Usage Tips
1. Use landscape orientation for better view
2. Zoom in if text is too small
3. Use desktop for data entry, mobile for viewing

---

## 🐞 Bug Report Template

When reporting a new bug, please include:
```markdown
### Bug Title
Brief description

**Priority**: Critical / Major / Minor
**Discovered**: YYYY-MM-DD
**Status**: New / In Progress / Fixed

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Environment**:
- Browser: Chrome / Firefox / Safari / Edge
- Version: X.X.X
- OS: Windows / Mac / iOS / Android
- Device: Desktop / Mobile / Tablet

**Screenshots/Errors**:
(if applicable)

**Workaround**:
(if known)

**Impact**:
Who is affected and how severely
```

---

## 📊 Bug Statistics

- **Total Known Bugs**: 0
- **Critical**: 0
- **Major**: 0
- **Minor**: 0
- **Limitations**: 10
- **Last Updated**: 2025-10-19

---

## ✅ Recently Fixed

### Version 3.0.0
- **Fixed**: Large file size making updates difficult
  - **Solution**: Split into modular files
  - **Status**: ✅ Resolved

### Version 2.0.0
- **Fixed**: No way to edit subscriptions/bills after creation
  - **Solution**: Added Edit functionality
  - **Status**: ✅ Resolved

- **Fixed**: Missing category system
  - **Solution**: Added categories for subscriptions and bills
  - **Status**: ✅ Resolved

---

## 🔍 Under Investigation

*No bugs currently under investigation*

---

## 💬 How to Report a Bug

1. Check if it's already listed here
2. Try the workaround if available
3. Document the bug using the template above
4. Add it to this file or create a GitHub issue
5. Include as much detail as possible

---

**Note**: This is a personal finance app. Always keep backups of your data!
