# Specification: Homepage Real Data & Cleanup

## Overview
This feature focuses on transitioning the Collectstory homepage from a template/placeholder state to a production-ready state with real user data and accurate information. It involves removing non-applicable sections (Stats, certain Features, Community link) and ensuring essential functional elements (Footer, Contact, Legal) are correctly implemented.

### Business Context
This feature directly supports the **Dezkareid Enterprise** objective of **High-Quality User Experience** by ensuring the product interface is polished, accurate, and functional. By removing misleading "placeholder" stats and non-existent features (AI inventory, Value tracking), we uphold the architectural principle of **Integrity and Auditability**, ensuring the system's presentation is transparent and trustworthy. Completing the legal and contact information also aligns with the **Operational Excellence** goal of building and maintaining user trust.

## Requirements

### Homepage Content
- **Real Data Integration**: The homepage must display live data instead of placeholders. Specifically, it should show the "Last Item Added" to the collection.
- **Section Removal (Stats)**: The "Statistics" section must be removed from the homepage as these metrics are not currently tracked or available.
- **Feature Set Refinement**: The "Features" section must be updated to remove references to:
  - Value AI Inventory
  - Value Tracking
- **Footer Enhancements**:
  - **Functional Share**: The "Share" functionality in the footer must be fixed to allow users to share the application or their collection.
  - **Legal Content**: The "Terms of Service" and "Privacy Policy" links must point to actual content (filled with appropriate text).
  - **Link Cleanup**: The "Community" link must be removed.
  - **Contact Fix**: The "Contact" link must be updated to trigger the user's default email client (mailto).

## Scope
- **In Scope**:
  - Homepage UI modifications.
  - Integration of "last added item" data.
  - Footer link and button updates.
  - Implementation of Terms of Service and Privacy Policy content.
- **Out of Scope**:
  - Implementation of AI-based features.
  - Implementation of a backend for statistics tracking.
  - Social media platform integrations beyond basic sharing.

## Acceptance Criteria
- [ ] The homepage successfully displays the most recently added item from the database.
- [ ] The "Statistics" section is no longer visible on the homepage.
- [ ] "Value AI Inventory" and "Value Tracking" are removed from the Features list.
- [ ] The "Share" button in the footer correctly opens a sharing dialog or performs a share action.
- [ ] Clicking "Terms of Service" or "Privacy Policy" displays the respective full text.
- [ ] The "Community" link is removed from the footer.
- [ ] Clicking the "Contact" link opens an email draft to "elmaildeldezkareid@gmail.com".

## Decisions
1. **Terms of Service & Privacy Policy Content**: Use a standard template for both.
2. **Contact Email**: The target email address is "elmaildeldezkareid@gmail.com".
3. **Public Button**: Decided to remove it from the footer as its purpose was unclear.
