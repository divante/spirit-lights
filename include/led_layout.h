#ifndef LED_LAYOUT_H
#define LED_LAYOUT_H

// LED index mapping for one side
#define NUM_ROWS 3
#define LEDS_PER_ROW 10
#define LOOP_LEDS 31
#define ANALOG_LED_INDEX 61 // Analog LED is not addressable, but mapped for logic
#define TOTAL_ADDRESSABLE_LEDS 61

// Row indices: 0-9, 10-19, 20-29
static const uint8_t row_indices[NUM_ROWS][LEDS_PER_ROW] = {
    {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
    {10, 11, 12, 13, 14, 15, 16, 17, 18, 19},
    {20, 21, 22, 23, 24, 25, 26, 27, 28, 29}};

// Loop indices: 30-60
static const uint8_t loop_indices[LOOP_LEDS] = {
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60};

#endif // LED_LAYOUT_H
