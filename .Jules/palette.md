# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - Accessible List Items with Internal Actions
**Learning:** When creating list items that are clickable and contain their own action buttons (like a star or delete button), using `role="button"` and `tabIndex={0}` on the outer container allows for keyboard navigation without breaking the validity of the HTML (avoiding nested buttons). It's crucial to handle both `Enter` and `Space` keys for the outer container and ensure `stopPropagation` is used on internal buttons to prevent triggering the list item selection when an action is clicked.
**Action:** Use `role="button"`, `tabIndex={0}`, and a proper `onKeyDown` handler for interactive list items, while maintaining `aria-label` on all internal action buttons.
