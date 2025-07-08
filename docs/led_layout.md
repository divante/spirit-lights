# LED Layout and Grouping

Each side of the car has:
- 61 addressable LEDs (WS2812 or similar)
- 1 analog (non-addressable) LED

## Physical Arrangement
- **Rows Group:** 3 parallel rows, 10 addressable LEDs each (total: 30 LEDs)
- **Loop Group:** 31 addressable LEDs arranged in a loop, with the analog LED in the center

## Logical Groups
- **Group 1 (Rows):** All 3 rows (30 LEDs)
- **Group 2 (Loop + Analog):** 31 addressable LEDs in the loop + 1 analog LED

Each group can display independent patterns.

## Turn Signal Integration
- Both groups must react to the turn signal (input via GPIO).
- When the turn signal is active, override or blend patterns as needed.

> See `src/led_layout.h` for mapping details.
