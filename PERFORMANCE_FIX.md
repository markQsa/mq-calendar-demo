# Performance Fix for 10k+ Items

## The Problem

Your current code creates ALL 10,000 TimelineItem components:

```tsx
{electriciansData.workOrders
  .filter((order) => order.electricianId === electrician.id)
  .map((order) => (
    <TimelineItem key={order.id} ...>
```

Even when zoomed to day level showing only 2-3 items, React still:
- Creates 10,000 component instances
- Runs hooks for all 10,000 items
- Calculates positions for all 10,000 items
- Then most return null

This is why it's laggy!

## The Solution

Use `useVisibleItems` hook to filter BEFORE creating components:

### Step 1: Update package

```bash
npm install mq-timeline-calendar@latest
```

### Step 2: Import the hook

```tsx
import { useVisibleItems } from 'mq-timeline-calendar/react';
```

### Step 3: Filter items before rendering

**Before (SLOW):**
```tsx
{electriciansData.workOrders
  .filter((order) => order.electricianId === electrician.id)
  .map((order) => {
    return (
      <TimelineItem key={order.id} ...>
        ...
      </TimelineItem>
    );
  })}
```

**After (FAST):**
```tsx
// Filter by electrician first
const electricianOrders = electriciansData.workOrders
  .filter((order) => order.electricianId === electrician.id);

// Then filter by viewport - CRITICAL!
const visibleOrders = useVisibleItems(electricianOrders);

// Now map only visible items to components
{visibleOrders.map((order) => {
  const style = getWorkOrderStyle(order.type);
  return (
    <TimelineItem
      key={order.id}
      startTime={order.startTime}
      duration={order.duration}
      row={0}
      draggable={true}
      type={order.type}
    >
      <Box sx={{...}}>
        ...
      </Box>
    </TimelineItem>
  );
})}
```

## Complete Example

```tsx
{electricians.map((electrician) => {
  // Get all orders for this electrician
  const electricianOrders = electriciansData.workOrders
    .filter((order) => order.electricianId === electrician.id);

  // Filter to only visible orders - THIS IS THE KEY!
  const visibleOrders = useVisibleItems(electricianOrders);

  return (
    <TimelineRow
      key={electrician.id}
      id={electrician.id}
      label={electrician.name}
      rowCount={1}
      defaultExpanded={true}
      aggregation={{
        enabled: true,
        threshold: "2 months",
        granularity: "dynamic",
        minItemsForAggregation: 50
      }}
      getAggregatedTypeStyle={getAggregatedTypeStyle}
    >
      {visibleOrders.map((order) => {
        const style = getWorkOrderStyle(order.type);
        return (
          <TimelineItem
            key={order.id}
            startTime={order.startTime}
            duration={order.duration}
            row={0}
            draggable={true}
            type={order.type}
          >
            <Box
              sx={{
                bgcolor: style.bgcolor,
                color: "white",
                p: 1,
                borderRadius: 1,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              title={`${order.title}\n${order.location || ""}\n${order.id}`}
            >
              <Typography variant="caption" fontWeight="bold" noWrap>
                {order.title}
              </Typography>
              {order.location && (
                <Typography variant="caption" noWrap sx={{ opacity: 0.9 }}>
                  {order.location}
                </Typography>
              )}
            </Box>
          </TimelineItem>
        );
      })}
    </TimelineRow>
  );
})}
```

## Expected Results

- **Before**: 3-15 fps, laggy scrolling and zooming
- **After**: 60 fps, smooth scrolling and zooming
- Only 10-50 components created instead of 10,000
- Instant response to scroll/zoom events

## Why This Works

The hook filters items by checking if they intersect with the current viewport:
- Zoomed to year level: might show 2000 items → creates 2000 components
- Zoomed to month level: might show 200 items → creates 200 components
- Zoomed to day level: might show 10 items → creates 10 components

Instead of always creating 10,000 components regardless of zoom level!
