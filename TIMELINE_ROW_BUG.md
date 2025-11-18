# TimelineRow Collapse/Expand Bug

## Issue Description
When using multiple TimelineRow components (10 electricians in this demo), the rows do not render correctly.

## Symptoms
1. **Initial Render**: Only the last row ("Maria Garcia") is visible
2. **After First Collapse**: All other rows suddenly appear
3. **Subsequent Collapses**: Clicking on one row's collapse button affects random/wrong rows

## Expected Behavior
- All rows should be visible on initial render
- Each row header should be positioned correctly with proper spacing
- Clicking a row's collapse button should only toggle that specific row

## Reproduction
1. Open the electricians demo with 10 TimelineRow components
2. Observe that only "Maria Garcia" row is visible
3. Click to collapse any row
4. Observe incorrect collapse/expand behavior

## Technical Details
- Component: `TimelineRow` from `mq-timeline-calendar/react`
- Version: 0.1.0-beta.12
- Number of rows: 10
- Each row configured with:
  - `collapsible={true}`
  - `defaultExpanded={true}`
  - `rowCount={1}`
  - Unique `id` prop

## Code Example
```tsx
<TimelineRowGroup>
  {electriciansData.electricians.map((electrician) => (
    <TimelineRow
      key={electrician.id}
      id={`electrician-${electrician.id}`}
      label={electrician.name}
      rowCount={1}
      collapsible={true}
      defaultExpanded={true}
    >
      {/* TimelineItems... */}
    </TimelineRow>
  ))}
</TimelineRowGroup>
```

## Suspected Root Cause
The bug appears to be in the `TimelineRowGroup` component's positioning calculation logic (`getCalculatedPosition` function) or in how row state is tracked when there are many rows.

Possible issues:
1. Row positions are not calculated correctly initially
2. Z-index issues causing rows to stack
3. State management bug in `toggleRow` function affecting wrong rows
4. Row registration order issue
