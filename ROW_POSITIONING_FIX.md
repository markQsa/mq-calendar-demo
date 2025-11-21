# Row Positioning Bug Fixed ✅

## The Problem

All timeline items were appearing in the first row (notification row) instead of being distributed across their respective electrician rows.

## Root Cause

**Library Bug in `TimelineItem.tsx`**: The `top` position calculation was using absolute row indices instead of being relative to the parent `TimelineRow`.

```typescript
// BEFORE (Bug):
const baseTop = effectiveRow * rowHeightPx;  // Always absolute!
```

When `row={0}` was specified, items would render at `top = 0`, placing them in the very first row of the entire timeline, regardless of their parent container.

## The Fix

Updated the `top` calculation to account for the parent TimelineRow's starting position:

```typescript
// AFTER (Fixed):
let absoluteRow = effectiveRow;
if (rowContext) {
  const headerHeight = 40;
  const headerRows = (rowContext.collapsible) ? headerHeight / rowHeightPx : 0;
  const containerStartRow = rowContext.startRow + headerRows;
  absoluteRow = containerStartRow + effectiveRow;  // Now relative to parent!
}
const baseTop = absoluteRow * rowHeightPx;
```

Now `row={0}` means:
- Row 0 **within the parent TimelineRow**
- Not row 0 of the entire timeline

## Changes Made

### Library (`mq-timeline-calendar`)
1. **Fixed**: `src/react/headless/TimelineItem.tsx` line 107-132
2. **Version**: Updated to `0.1.0-beta.36`
3. **Published**: Available on npm

### Test Project
1. **Updated**: Package to `mq-timeline-calendar@0.1.0-beta.36`
2. **Kept**: `row={0}` in `ElectricianRowItems` component (line 750)
3. **Restarted**: Dev server to pick up the new version

## Expected Result

Now items should render correctly:
- ✅ Notification pinpoints in the notification row
- ✅ Electrician work orders in their respective electrician rows
- ✅ Items with `row={0}` render in row 0 of their parent container

## Testing

1. Open http://localhost:5173/
2. Check that:
   - Notification pinpoints are in the top row
   - Each electrician row shows their own work orders
   - Items are distributed correctly, not all in one row
3. Zoom and scroll to verify performance is still smooth

## Technical Details

The fix matches the logic already used for drag handling (lines 165-172), which correctly calculated row offsets. The rendering `top` calculation was simply missing this same logic.

**Before**: All items → row 0 of timeline → notification row
**After**: Items → row 0 of parent → correct electrician row

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
