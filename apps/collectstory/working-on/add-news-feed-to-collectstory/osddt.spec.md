# Specification: News Feed for Collecstory

## Overview
The News Feed is a central activity stream designed to surface the latest happenings across the Collecstory platform. It provides users with a real-time (or near real-time) view of new items added to catalogs, newly opened stores, active promotions, and other significant platform events. The primary goal is to foster community engagement and increase the discoverability of content and potential clients (stores).

## Business Context
This feature aligns with the following Dezkareid Enterprise strategic goals:
- **Innovation & Growth**: Directly supports the key result of expanding the Collecstory user base through improved community engagement and visibility of platform activity.
- **Native Discoverability**: Surfaces new products, stores, and promotions that might otherwise remain hidden, making the ecosystem inherently more searchable and accessible to potential buyers.
- **High-Quality User Experience**: By providing a "live" feel to the application, we increase user retention and satisfaction.

## Requirements
### Functional Requirements
- **Activity Aggregation**: The system must track and display the following events:
    - New items added to any public catalog.
    - New store registrations.
    - Active promotions launched by stores.
    - Presale events initiated by stores.
    - New user/store sessions (if publicly shareable).
- **Feed Item Structure**: Each feed item must clearly display:
    - The actor (User or Store name/avatar).
    - The action (e.g., "added a new item", "opened a store").
    - The subject (Item name, Store name).
    - A timestamp of the activity.
- **Navigation**: Clicking on any feed item must navigate the user to the relevant detail page (e.g., Item page, Store profile).
- **Sorting**: The feed must be sorted chronologically, with the most recent activities at the top.
- **Responsiveness**: The feed component must be fully responsive and accessible, following the "Universal Accessibility" principle.

## Scope
### In-Scope
- A dedicated News Feed UI component/page.
- Backend logic to aggregate events from various sources (Catalogs, Stores, Sessions).
- Basic filtering by activity type (e.g., "Show only promotions").
- Pagination or infinite scrolling for the feed.

### Out-of-Scope
- Social interactions on feed items (likes, comments, shares) for this initial phase.
- Personalization based on "Following" (the initial version will be a global discovery feed).
- Real-time "push" updates (WebSockets); polling or manual refresh is acceptable initially.

## Acceptance Criteria
- Users can view a list of recent platform activities upon landing on the feed.
- Each activity type (Catalog item, Store, Promotion) is visually distinguishable.
- Navigating to a subject from the feed works correctly for all activity types.
- The feed handles "no data" states gracefully (e.g., "No recent activity").
- The performance of the feed does not degrade significantly as the number of platform events increases.

## Open Questions
- **Privacy**: Should users or stores have an opt-out mechanism to prevent their activities from appearing in the global feed?
- **Personalization**: Should we prioritize activities from a specific region or category if the feed becomes too noisy?
- **Engagement**: Is the "New Session" activity strictly for store owners, or should it include regular users? (May be too noisy if it's every user login).
- **Timeframe**: What is the maximum age of an activity to be considered "news"? (e.g., events older than 30 days are removed).
