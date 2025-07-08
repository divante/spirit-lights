#ifndef HEADLIGHT_H
#define HEADLIGHT_H

#include <stdint.h>
#include "led_layout.h"
#include "led_color.h"
#include "patterns.h"

#define LED_BUFFER_SIZE TOTAL_ADDRESSABLE_LEDS

typedef struct
{
  rgb_t led_buffer[LED_BUFFER_SIZE];
  uint8_t analog_brightness;
  pattern_mode_t mode;
  pattern_mode_t prev_mode;
  uint32_t last_tick;
  uint8_t turn_signal_active;
  uint32_t pattern_time_ms; // Add this field for per-headlight animation time
  // Add more fields as needed (timing, custom state, etc.)
} headlight_t;

void headlight_init(headlight_t *h);
void headlight_reset(headlight_t *h);
void headlight_update(headlight_t *h, headlight_t *other, uint32_t time_ms, uint8_t turn_signal);
void headlight_show(headlight_t *h, uint8_t side);
void headlight_sync_pattern_time(headlight_t *a, headlight_t *b);

#endif // HEADLIGHT_H
