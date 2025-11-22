# Performance Analysis

## The Problem

Even with viewport filtering in TimelineRow, we're still creating 10,000 React components:

```tsx
React.Children.map(children, (child) => {
  // This runs for ALL 10,000 children!
  // React components are already created at this point
  if (item is outside viewport) {
    return null;  // Component was already created, just not rendered
  }
  return child;
})
```

**Performance Impact:**
- Creates 10,000 TimelineItem instances
- Runs all hooks 10,000 times  
- Calculates positions 10,000 times
- Then most return null

## The Solution

We need to filter BEFORE creating components, but we also need all items for aggregation.

**Approach:** TimelineRow should accept item data separately from children.

```tsx
<TimelineRow
  items={allItems}  // For aggregation and filtering
  renderItem={(item) => <TimelineItem ... />}  // Only called for visible items
>
```

This way:
- Aggregation uses items array
- Rendering only creates visible components
