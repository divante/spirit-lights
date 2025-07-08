# LED Grouping and Control Logic

- **Group 1 (Rows):**
  - 3 parallel rows, 10 addressable LEDs each
  - Controlled as a single group for patterns
- **Group 2 (Loop + Analog):**
  - 31 addressable LEDs in a loop
  - 1 analog LED in the center
  - Controlled as a single group for patterns

## Firmware Structure (Suggested)
- `led_layout.h`: Defines LED indices for each group
- `patterns.c/h`: Functions for group patterns
- `turn_signal.c/h`: Handles turn signal input and overrides
- `main.c`: Main loop, calls group pattern functions and checks turn signal

## Example Pattern Logic
- Normal: Each group runs its own pattern
- Turn Signal: Both groups switch to a turn signal animation (e.g., sequential wipe)

> Implementation details in firmware source files.
