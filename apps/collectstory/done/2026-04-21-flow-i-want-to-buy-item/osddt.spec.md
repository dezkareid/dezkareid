# Feature Specification: "I Want to Buy" Flow

## Overview
The goal of this feature is to bridge the gap between a user's personal collection and the ability to purchase those items. By identifying items in a collection that are also available in the catalog, we can provide users with direct links to stores (online or physical) where they can buy the item.

## Requirements
1. **Purchase Call-to-Action**: Any item displayed in a user's collection that has a direct relation to a catalog item must feature a prominent "I want to buy" button.
2. **Catalog Stores View**: Clicking the "I want to buy" button must redirect the user to a dedicated page within the catalog: `/catalog/[slug]/stores`.
3. **Item Context**: The `/catalog/[slug]/stores` page must display the details of the item being searched for to maintain context.
4. **Store List**: The page must list all stores that carry the specific catalog item.
5. **Store Information**: Each store entry in the list must display:
   - Store Logo
   - Store Name
   - City (Location)
6. **Smart Redirection**:
   - The primary element/card for each store must act as a direct link to the specific **product URL** (the store's external page for that item).
   - Each store entry must also include a secondary "Visit Store" button.

## Scope
- **In Scope**:
  - Logic to detect relations between collection items and catalog items.
  - UI updates for collection item cards/details to include the "I want to buy" button.
  - Creation of the `/catalog/[slug]/stores` route and page.
  - Implementation of the store listing with logo, name, and city data.
  - Handling of primary (product URL) and secondary (store visit) navigation.
- **Out of Scope**:
  - Real-time inventory verification (assumes data is provided by the backend).
  - In-app checkout or payment processing.
  - Management of store or catalog relations (assumes the relation already exists in the data).

## Acceptance Criteria
- The "I want to buy" button is visible **only** on collection items linked to a catalog item.
- Clicking the button correctly resolves the `[slug]` and navigates to the stores page.
- The stores page displays a list of available stores with their logo, name, and city.
- Clicking on a store's information card opens the specific product's external URL in a new tab.
- The "Visit Store" button navigates the user appropriately (e.g., to a store landing page).

## Decisions
1. **Stock Status**: Show an empty state when no stores carry the item.
2. **"Visit Store" Target**: The button navigates to an internal store profile page.
3. **Navigation Behavior**: Product URLs open in a new tab.
4. **Data Availability**: Store Name is mandatory; use fallbacks for optional elements like logo or city.
