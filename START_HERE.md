# START HERE - Quick Reference

**If you're Claude in a new chat, read this first!**

## 📋 Current Status

- **Project**: Budget Tracker - Personal Finance Web App
- **Current Version**: 3.1.0
   - **Last Updated**: 2025-10-20
- **Status**: Active Development
- **Live URL**: https://honeyryder3318.github.io/budget-tracker/

## 🎯 Project Goal

A personal budget tracking web app that helps manage:
- Income/expense transactions
- Subscriptions (monthly, quarterly, semi-annual, annual)
- Recurring bills (same frequencies)
- Budget limits by category
- Savings tracking for non-monthly payments

## 🏗️ Technical Stack

- **Framework**: React 18 (via CDN - no build process)
- **Styling**: Tailwind CSS (via CDN)
- **Storage**: Browser localStorage (no backend)
- **Deployment**: GitHub Pages
- **File Structure**: Modular - 6 separate JS files

## 📁 File Locations

**Live Code (GitHub)**: 
- Repository: `honeyryder3318/budget-tracker`
- Branch: `main`

**Backup (Google Drive)**: 
- Folder: `budget-trackerV3`

**Project Documentation** (in this Project folder):
- README.md - Full project documentation
- CHANGELOG.md - Version history
- TODO.md - Future features list
- BUGS.md - Known issues
- ARCHITECTURE.md - Technical details
- START_HERE.md - This file

**Code Files** (should be in Project folder):
```
current-code/
├── index.html
└── js/
    ├── icons.js
    ├── utils.js
    ├── modals.js
    ├── pages.js
    ├── dashboard.js
    └── main.js
```

## 🔄 Version Control Workflow

When making updates, always:

1. **Update the code files**
2. **Update CHANGELOG.md** with changes
3. **Update TODO.md** (mark completed items)
4. **Update BUGS.md** (if fixing bugs)
5. **Determine new version number**:
   - Bug fix only: Increment PATCH (3.0.0 → 3.0.1)
   - New feature: Increment MINOR (3.0.0 → 3.1.0)
   - Major change: Increment MAJOR (3.0.0 → 4.0.0)
6. **Guide user through GitHub release**:
   - Releases → Create new release
   - Tag: v[X.X.X]
   - Title: Version [X.X.X] - [Brief Description]
   - Description: Copy from CHANGELOG
7. **Update this file** with new version number

## 🚨 Important Constraints

**MUST REMEMBER:**
- User is NOT technical - avoid command line instructions
- Use GitHub web interface only for all tasks
- Break updates into small, easy steps
- Always test before committing
- User doesn't know React deeply - explain when needed
- localStorage is the ONLY storage (no backend yet)

## 📝 Communication Style

- Be clear and patient
- Use step-by-step instructions
- Use emojis for clarity ✅ ❌ 🎯
- Explain technical terms
- Provide copy-paste code blocks
- Always verify user understands

## 🎯 Current Priority Items

Check TODO.md for full list, but top priorities are:
1. Delete budgets functionality
2. Edit transactions
3. Recurring income tracking

## 📞 Common User Questions

**Q: "How do I update this?"**
A: Guide through GitHub web interface, step by step

**Q: "We made changes but I started a new chat"**
A: Ask user to tell you what changed, check CHANGELOG.md

**Q: "Can you access the previous conversation?"**
A: No - rely on documentation files in Project

**Q: "What version are we on?"**
A: Check the "Current Version" at top of this file

**Q: "I found a bug"**
A: Add to BUGS.md, fix it, update CHANGELOG, create new version

## 🔄 Typical Update Process

1. User describes desired feature/fix
2. Review TODO.md and current code
3. Make changes to appropriate file(s)
4. Test the changes
5. Update documentation
6. Determine version number
7. Guide user through:
   - Committing to GitHub
   - Creating release/tag
   - Updating this START_HERE file

## ⚠️ Red Flags

If you see these, ask questions first:
- User wants to add backend (major change)
- User wants to add authentication (security concern)
- User wants to change file structure (could break things)
- User wants features requiring localStorage replacement

## ✅ Green Lights

These are safe to proceed with:
- Adding new modals/forms
- New calculations/features
- UI/styling changes
- Bug fixes in existing code
- Adding to existing pages

## 📚 Key Files to Check

**Before starting any work:**
1. Read CHANGELOG.md - See what's been built
2. Read TODO.md - See what's planned
3. Read BUGS.md - See known issues
4. Review ARCHITECTURE.md - Understand structure

**During work:**
- Reference current code files
- Check ARCHITECTURE.md for patterns

**After work:**
- Update CHANGELOG.md
- Update TODO.md
- Update BUGS.md (if relevant)
- Update version number here

## 🎓 Learning Resources for User

If user wants to learn more:
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- GitHub: https://docs.github.com
- Semantic Versioning: https://semver.org

## 🆘 Emergency: Something Broke

1. Check GitHub commits - find last working version
2. Go to that commit
3. Download/copy working code
4. Ask user what changed since then
5. Fix incrementally

## 📞 Template for User to Start New Chat

Suggest user starts new chats with:
```
I need help with my Budget Tracker app.
- Current version: [check START_HERE.md]
- Read: START_HERE.md, CHANGELOG.md, TODO.md
- I want to: [describe request]
- Code is in: current-code folder
```

---

**Last Updated**: 2025-10-19
**By**: Project Owner
**Next Review**: When version changes
```

---

## ✅ Action Items for You RIGHT NOW

To set yourself up for success in future chats:

### 1. Create START_HERE.md
- [ ] Create in GitHub repo root
- [ ] Add to Project folder (this conversation)

### 2. Add Your Current Code to Project
- [ ] Download all your JS files from GitHub
- [ ] Add them to Project folder in a `current-code` folder
- [ ] Include index.html too

### 3. Keep Project Folder Updated
Every time we make changes:
- [ ] Update the code files in Project folder
- [ ] Update CHANGELOG.md
- [ ] Update TODO.md
- [ ] Update START_HERE.md version number

### 4. Start New Chats Correctly
When you start a new chat, say:
```
"Hi! Please read START_HERE.md and CHANGELOG.md in the Project.
I need help with [specific task] on my Budget Tracker app."
