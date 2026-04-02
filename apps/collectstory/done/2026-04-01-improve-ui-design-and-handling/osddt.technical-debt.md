# Technical Debt: Improve UI Design and Error Handling

## Unfinished Manual Validations

The following validation tasks were deferred from the original implementation plan. They require a running browser environment or authenticated session and could not be automated as part of the feature delivery.

---

### Lighthouse Audits

| Page | Mode | Targets |
|------|------|---------|
| Home page | Mobile | Performance ≥ 90, Accessibility ≥ 90 |
| Home page | Desktop | Performance ≥ 90, Accessibility ≥ 90 |
| Collection page | Mobile (authenticated) | Performance ≥ 90, Accessibility ≥ 90 |

**How to run:** Use Chrome DevTools → Lighthouse, or the Chrome MCP Lighthouse tool against the deployed/preview URL.

---

### Manual UI Checks

- [ ] No horizontal scroll at 375px on home, collection, and item detail pages
- [ ] All touch targets ≥ 44px (home CTA, collection buttons, modal controls)
- [ ] Modals fully visible and scrollable on mobile without content cut off
- [ ] Body text ≥ 16px on all pages
- [ ] Item grid is single column at 375px

---

### Accessibility Sweep

- [ ] Zero critical violations on home and collection pages (run axe DevTools or browser a11y audit)

---

### Regression Checks

- [ ] `/stores` page renders correctly (only `visible = true` stores shown)
- [ ] Admin stores page — verified toggle and soft-delete work correctly
- [ ] Full add-item flow (modal → form → image upload → submit) works end-to-end
- [ ] Public item detail page — stores (read-only) visible to all; `ItemLinksManager` visible to owner only
