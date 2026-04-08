# Feature Specification: Social Sharing and Reporting

## Overview
This feature introduces social sharing capabilities for core entities in the Collecstory application—Profiles, Collections, and Items—to drive organic traffic and improve discoverability. Additionally, it implements a persistent "Report Problems" mechanism to enhance user trust and operational excellence by providing a direct feedback loop for issues.

### Business Context
This feature directly supports **Dezkareid Enterprise's** strategic goals for 2026:
- **Innovation & Growth**: Increases organic discoverability and community engagement for Collecstory, aiming for a 50% user base expansion.
- **Operational Excellence**: Provides a structured way for users to report issues, supporting the goal of reducing time-to-resolution by 30%.
- **High-Quality User Experience**: Enhances discoverability and usability, ensuring the product is easy to find and interact with.
- **Native Discoverability (Architecture Principle)**: By enabling sharing, we leverage social indexing and peer-to-peer discovery.

## Requirements

### Social Sharing
- **Entity Support**: Users must be able to share their own or others' **Profiles**, **Collections**, and individual **Items**.
- **Sharing Methods**:
    - **Web Share API**: Utilize the native browser sharing capabilities where supported (mobile and modern desktop browsers).
    - **Platform Fallbacks**: Provide direct sharing links for major platforms (Twitter/X, Facebook, LinkedIn).
    - **Link Copy**: Always provide a "Copy Link" option as a universal fallback.
- **Visual Integration**: Sharing triggers should be contextually placed (e.g., near the entity title or in a dedicated action menu).

### Problem Reporting
- **Persistent Access**: A floating "Report Problem" button must be available to users across the application.
- **Input Collection**: The reporting mechanism must collect:
    - Type of problem (e.g., Bug, Suggestion, Inappropriate Content).
    - Description of the issue.
    - Contextual information (automatically captured URL/page state if possible).
- **Submission Feedback**: Users must receive clear confirmation after submitting a report.

## Scope
- **In Scope**:
    - Sharing triggers on Profile, Collection, and Item pages.
    - Integration with Web Share API.
    - Social platform sharing templates (URL + Title).
    - UI for a floating "Report Problem" button.
    - A simple modal/form for issue submission.
- **Out Scope**:
    - Advanced analytics on sharing clicks (beyond basic event tracking).
    - Complex moderation dashboard for reports (initial version will focus on data capture).
    - Deep integration with third-party bug tracking tools (Jira/Linear) in this phase.

## Acceptance Criteria
- [ ] Sharing buttons are visible and functional on all Profile, Collection, and Item views.
- [ ] On mobile devices, the native share sheet is triggered when "Share" is clicked.
- [ ] On desktop, a menu appears with options for Twitter, Facebook, LinkedIn, and Copy Link.
- [ ] The shared URL correctly points to the specific entity being viewed.
- [ ] A floating button labeled "Report" (or with a recognizable icon) is visible on the screen.
- [ ] Clicking the "Report" button opens a modal without navigating away from the current page.
- [ ] Submitting the report form sends the data to the backend and shows a "Thank you" message.

## Decisions
1. **Reporting Scope**: Just for report problems
2. **Placement**: Bottom right
3. **Authentication**: logged-in only
4. **Backend Target**: Just a link to my email
