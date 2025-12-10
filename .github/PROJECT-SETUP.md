# GitHub Project Setup Guide

> Step-by-step guide to set up your GitHub Project board for Pet Realm

This guide will help you create a professional GitHub Project board to manage all features, bugs, and enhancements systematically.

---

## 📋 Table of Contents

1. [Create GitHub Project](#1-create-github-project)
2. [Configure Project Settings](#2-configure-project-settings)
3. [Set Up Custom Fields](#3-set-up-custom-fields)
4. [Create Views](#4-create-views)
5. [Add Labels to Repository](#5-add-labels-to-repository)
6. [Create Issues from ISSUES.md](#6-create-issues-from-issuesmd)
7. [Add Issues to Project](#7-add-issues-to-project)
8. [Set Up Milestones](#8-set-up-milestones)
9. [Workflow Tips](#9-workflow-tips)

---

## 1. Create GitHub Project

### Via GitHub Website

1. Go to your repository: `https://github.com/MystSugar/pet-realm`
2. Click **"Projects"** tab at the top
3. Click **"New project"** button
4. Choose **"Board"** template
5. Name it: **"Pet Realm Development"**
6. Description: **"Feature tracking and development workflow for Pet Realm marketplace"**
7. Click **"Create project"**

---

## 2. Configure Project Settings

### Project Settings

1. Click the **"..."** menu (top right)
2. Select **"Settings"**
3. Configure:
   - **Visibility**: Private (for now) or Public
   - **README**: Add project description
   - **Closed issues**: Show closed issues (optional)

### Default Column Setup

Your board starts with these columns:
- **Todo** → Rename to **"Backlog"**
- **In Progress**
- **Done**

Add additional columns:
1. Click **"+ New column"**
2. Add: **"Ready"** (between Backlog and In Progress)
3. Add: **"Review"** (between In Progress and Done)

**Final columns:**
```
Backlog → Ready → In Progress → Review → Done
```

---

## 3. Set Up Custom Fields

Custom fields help you organize and filter issues.

### Add Priority Field

1. Click **"..."** menu → **"Settings"** → **"Custom fields"**
2. Click **"+ New field"**
3. Name: **"Priority"**
4. Type: **"Single select"**
5. Options:
   - 🔴 **P0 - Critical**
   - 🟠 **P1 - High**
   - 🟡 **P2 - Medium**
   - 🟢 **P3 - Low**
6. Click **"Save"**

### Add Size Field

1. Create new field
2. Name: **"Size"**
3. Type: **"Single select"**
4. Options:
   - **XS** (< 2 hours)
   - **S** (2-4 hours)
   - **M** (1-2 days)
   - **L** (3-5 days)
   - **XL** (1+ weeks)
5. Click **"Save"**

### Add Status Field (Auto-created)

GitHub automatically creates a **"Status"** field matching your columns.

### Optional: Add Version Field

1. Name: **"Version"**
2. Type: **"Single select"**
3. Options: v0.9.0, v1.0.0, v1.1.0, v2.0.0, v3.0.0

---

## 4. Create Views

Views help you see your work from different perspectives.

### View 1: Board (Default)

- **Type**: Board
- **Group by**: Status
- **Sort by**: Priority (High to Low)

### View 2: By Milestone

1. Click **"+ New view"**
2. Name: **"By Milestone"**
3. Type: **"Table"**
4. Group by: **"Milestone"**
5. Columns to show:
   - Title
   - Status
   - Priority
   - Size
   - Labels
   - Assignee

### View 3: Current Sprint (v1.0.0)

1. Create new view
2. Name: **"v1.0.0 Sprint"**
3. Type: **"Board"**
4. Filter:
   - Milestone = v1.0.0
   - Status ≠ Done
5. Group by: Status
6. Sort by: Priority

### View 4: Backlog

1. Create new view
2. Name: **"Backlog"**
3. Type: **"Table"**
4. Filter: Status = Backlog
5. Sort by: Priority then Size
6. Show: Title, Priority, Size, Milestone

---

## 5. Add Labels to Repository

Labels categorize issues. Add these to your repository.

### Navigate to Labels

1. Go to repository
2. Click **"Issues"** tab
3. Click **"Labels"** button
4. Click **"New label"** for each below

### Priority Labels

| Label | Color | Description |
|-------|-------|-------------|
| `P0-critical` | `#d73a4a` (red) | Blocking issues, production down |
| `P1-high` | `#ff9800` (orange) | Important for next release |
| `P2-medium` | `#ffeb3b` (yellow) | Nice to have |
| `P3-low` | `#4caf50` (green) | Future consideration |

### Size Labels

| Label | Color | Description |
|-------|-------|-------------|
| `XS` | `#c2e0c6` (light green) | Less than 2 hours |
| `S` | `#bfd4f2` (light blue) | 2-4 hours |
| `M` | `#d4c5f9` (light purple) | 1-2 days |
| `L` | `#f9c5d1` (light pink) | 3-5 days |
| `XL` | `#fad8c7` (light orange) | 1+ weeks |

### Type Labels

| Label | Color | Description |
|-------|-------|-------------|
| `feature` | `#0075ca` (blue) | New functionality |
| `enhancement` | `#a2eeef` (cyan) | Improvement to existing |
| `bug` | `#d73a4a` (red) | Something broken |
| `docs` | `#0e8a16` (green) | Documentation |
| `chore` | `#fef2c0` (beige) | Maintenance |

### Area Labels

| Label | Color | Description |
|-------|-------|-------------|
| `auth` | `#5319e7` (purple) | Authentication |
| `shop` | `#1d76db` (blue) | Shop management |
| `orders` | `#e99695` (pink) | Order system |
| `products` | `#f9d0c4` (peach) | Product management |
| `ui` | `#d4c5f9` (lavender) | User interface |
| `api` | `#bfd4f2` (sky blue) | Backend API |
| `database` | `#c5def5` (light blue) | Database schema |
| `admin` | `#b60205` (dark red) | Admin features |
| `mobile` | `#fbca04` (yellow) | Mobile specific |

---

## 6. Create Issues from ISSUES.md

Now create actual GitHub Issues from your ISSUES.md file.

### Manual Creation (Recommended for Learning)

For each issue in `.github/ISSUES.md`:

1. Go to **Issues** tab
2. Click **"New issue"**
3. Fill in:
   - **Title**: Copy from issue heading
   - **Description**: Copy user story, acceptance criteria, technical notes
   - **Labels**: Add all relevant labels (priority, size, type, area)
   - **Milestone**: Select version
   - **Assignee**: Assign to yourself
4. Click **"Submit new issue"**

**Example for Issue #1:**

```markdown
**Title**: Search Dropdown with Autocomplete Suggestions

**Description**:
**User Story**: As a customer, I want to see product suggestions as I type in the search box so I can quickly find what I'm looking for.

**Acceptance Criteria**:
- [ ] Dropdown appears after typing 2+ characters
- [ ] Shows top 5 matching products with images and prices
- [ ] Click suggestion to go directly to product page
- [ ] Keyboard navigation (arrow keys, enter)
- [ ] Debounced API calls (300ms)
- [ ] Empty state when no results
- [ ] "View all results" link at bottom

**Technical Notes**:
- Create `/api/products/suggestions` endpoint
- Use fuzzy search on product name
- Cache recent searches
- Mobile-responsive dropdown

**Labels**: feature, P1-high, L, ui, api
**Milestone**: v1.0.0
```

### Bulk Creation (Advanced)

Use GitHub CLI to create issues in bulk:

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Create issue
gh issue create \
  --title "Search Dropdown with Autocomplete" \
  --body-file .github/issue-templates/search-autocomplete.md \
  --label "feature,P1-high,L,ui,api" \
  --milestone "v1.0.0"
```

**Tip**: Start with v1.0.0 issues first (27 issues), then add others later.

---

## 7. Add Issues to Project

### Link Issues to Project

**Option 1: From Issue Page**
1. Open an issue
2. Click **"Projects"** in right sidebar
3. Select **"Pet Realm Development"**
4. Issue appears in "Backlog" column

**Option 2: From Project Board**
1. Open your project
2. Click **"+ Add item"** at bottom of column
3. Search for issue number or title
4. Click to add

### Set Custom Fields

For each issue in the project:
1. Click the issue card
2. Set **Priority** (P0-P3)
3. Set **Size** (XS-XL)
4. Set **Milestone** (v1.0.0, etc.)

---

## 8. Set Up Milestones

Milestones group issues by version release.

### Create Milestones

1. Go to **Issues** → **Milestones**
2. Click **"New milestone"**
3. Create each:

**v1.0.0 - Enhanced Core**
- Due date: March 31, 2025
- Description: "Search enhancements, social login, multiple addresses, email notifications, GST tax system, reviews"

**v1.1.0 - User Experience**
- Due date: June 30, 2025
- Description: "Mode switching, price filters, order cancellation, database sessions"

**v1.2.0 - Engagement**
- Due date: September 30, 2025
- Description: "Wishlist, shop followers, discount codes, promotions"

**v2.0.0 - Platform Expansion**
- Due date: December 31, 2025
- Description: "Admin system, shop verification, pet profiles, veterinary services, community"

**v3.0.0 - Advanced**
- Due date: March 31, 2026
- Description: "Multi-shop, analytics, payment gateway, mobile app, advanced features"

### Assign Issues to Milestones

When creating issues, select the appropriate milestone.

---

## 9. Workflow Tips

### Daily Workflow

**Morning**:
1. Open Project board
2. Review "In Progress" items
3. Move completed items to "Review" or "Done"
4. Pick next item from "Ready"

**During Work**:
1. Update issue with progress comments
2. Check off acceptance criteria as you complete them
3. Link pull requests to issues

**Evening**:
1. Update issue statuses
2. Comment on blockers
3. Plan tomorrow's work

### Moving Issues Between Columns

**Backlog → Ready**:
- Issue is well-defined
- Dependencies resolved
- Priority set

**Ready → In Progress**:
- You start working on it
- Assign to yourself
- Create feature branch

**In Progress → Review**:
- Code complete
- Pull request created
- Ready for testing

**Review → Done**:
- Code reviewed and approved
- Merged to main
- Tested in production
- Issue closed

### Branch Naming

Link branches to issues:

```bash
# Format: type/issue-number-short-description
git checkout -b feature/1-search-autocomplete
git checkout -b fix/23-tax-calculation
git checkout -b enhancement/10-address-selection
```

### Commit Messages

Reference issues in commits:

```bash
git commit -m "feat: add search autocomplete dropdown (#1)"
git commit -m "fix: calculate tax correctly in checkout (#23)"
git commit -m "docs: update README with setup instructions"
```

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Related Issue
Closes #[issue number]

## Changes Made
- Change 1
- Change 2

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Tested on mobile

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
```

### Automation

Set up GitHub Actions for automation:

**Auto-move issues**:
- When PR opened → Move to "Review"
- When PR merged → Move to "Done"
- When issue assigned → Move to "Ready"

**Auto-label PRs**:
- Based on files changed
- Based on branch name

---

## 🎯 Quick Start Checklist

Use this checklist to set up your project:

- [ ] Create GitHub Project
- [ ] Rename columns to Backlog/Ready/In Progress/Review/Done
- [ ] Add custom fields (Priority, Size)
- [ ] Create views (Board, By Milestone, Current Sprint, Backlog)
- [ ] Add all labels to repository
- [ ] Create milestones (v1.0.0, v1.1.0, v2.0.0, v3.0.0)
- [ ] Create issues for v1.0.0 (27 issues)
- [ ] Add issues to project board
- [ ] Set priority and size for each issue
- [ ] Move P1-high issues to "Ready" column
- [ ] Start working on first issue!

---

## 📚 Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [GitHub CLI Documentation](https://cli.github.com/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🤝 Need Help?

If you get stuck:
1. Check GitHub's official documentation
2. Watch GitHub Projects tutorials on YouTube
3. Ask in GitHub Community Forum
4. Reference this guide

---

**Good luck with your project management journey!** 🚀

Remember: The goal is to learn and improve, not perfection. Start simple and add complexity as you get comfortable.
