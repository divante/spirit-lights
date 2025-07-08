#include "headlight.h"
#include <string.h>
#include <math.h>
#include <stdbool.h>
#include "led_layout.h"
#define LED_BUFFER_SIZE TOTAL_ADDRESSABLE_LEDS

static rgb_t lerp_yellow_orange(float t)
{
  rgb_t c;
  c.r = 255;
  c.g = (uint8_t)(200.0f * (1.0f - t) + 120.0f * t);
  c.b = 0;
  return c;
}

void headlight_init(headlight_t *h)
{
  memset(h->led_buffer, 0, sizeof(h->led_buffer));
  h->analog_brightness = 0;
  h->mode = PATTERN_MODE_NORMAL;
  h->prev_mode = PATTERN_MODE_NORMAL;
  h->last_tick = 0;
  h->turn_signal_active = 0;
  h->pattern_time_ms = 0;
}

void headlight_reset(headlight_t *h)
{
  memset(h->led_buffer, 0, sizeof(h->led_buffer));
  h->analog_brightness = 0;
}

static void pattern_rows_headlight(headlight_t *h, uint32_t time_ms)
{
  float speed = 0.001f;
  for (int diag = 0; diag < LEDS_PER_ROW; ++diag)
  {
    float t = 0.5f * (1.0f + sinf(speed * time_ms + diag));
    rgb_t color = lerp_yellow_orange(t);
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      int led_idx = row_indices[row][LEDS_PER_ROW - 1 - diag];
      h->led_buffer[led_idx] = color;
    }
  }
  for (int diag = 1; diag < LEDS_PER_ROW; ++diag)
  {
    float t = 0.5f * (1.0f + sinf(speed * time_ms + diag + 0.5f));
    rgb_t color = lerp_yellow_orange(t);
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      int led_idx = row_indices[row][LEDS_PER_ROW - diag];
      h->led_buffer[led_idx] = color;
    }
  }
}

static void pattern_loop_analog_headlight(headlight_t *h, uint32_t time_ms)
{
  float speed = 0.001f;
  float progress = 0.5f * (1.0f + sinf(speed * time_ms));
  for (int i = 0; i < LOOP_LEDS; ++i)
  {
    float led_pos = (float)i / (float)(LOOP_LEDS - 1);
    float t = progress - led_pos;
    if (t < 0)
      t = 0;
    if (t > 1)
      t = 1;
    rgb_t color = lerp_yellow_orange(t);
    h->led_buffer[loop_indices[i]] = color;
  }
  h->analog_brightness = (progress < 0.5f) ? (uint8_t)(progress * 2.0f * 255.0f) : (uint8_t)((1.0f - progress) * 2.0f * 255.0f);
}

static void pattern_turn_signal_headlight(headlight_t *h, uint32_t time_ms, uint8_t active)
{
  static const rgb_t orange = {255, 120, 0};
  if (!active)
  {
    h->last_tick = 0;
    headlight_reset(h);
    return;
  }
  if (h->last_tick == 0)
    h->last_tick = time_ms;
  float speed = 0.003f;
  float cycle = fmodf((time_ms - h->last_tick) * speed, 2.0f);
  int led_count = (int)(LEDS_PER_ROW * cycle);
  if (cycle < 1.0f)
  {
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      for (int i = 0; i < led_count && i < LEDS_PER_ROW; ++i)
        h->led_buffer[row_indices[row][i]] = orange;
      for (int i = led_count; i < LEDS_PER_ROW; ++i)
        h->led_buffer[row_indices[row][i]] = (rgb_t){0, 0, 0};
    }
  }
  else
  {
    int off_count = led_count - LEDS_PER_ROW;
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      for (int i = 0; i < off_count && i < LEDS_PER_ROW; ++i)
        h->led_buffer[row_indices[row][i]] = (rgb_t){0, 0, 0};
      for (int i = off_count; i < LEDS_PER_ROW; ++i)
        h->led_buffer[row_indices[row][i]] = orange;
    }
  }
}

void headlight_sync_pattern_time(headlight_t *a, headlight_t *b)
{
  uint32_t sync_time = (a->pattern_time_ms > b->pattern_time_ms) ? a->pattern_time_ms : b->pattern_time_ms;
  a->pattern_time_ms = sync_time;
  b->pattern_time_ms = sync_time;
}

void headlight_update(headlight_t *h, headlight_t *other, uint32_t time_ms, uint8_t turn_signal)
{
  pattern_mode_t new_mode = turn_signal ? PATTERN_MODE_TURN_SIGNAL : PATTERN_MODE_NORMAL;
  if (new_mode != h->mode)
  {
    headlight_reset(h);
    h->mode = new_mode;
    h->last_tick = 0;
    // If just switched to normal and other is normal, sync time
    if (new_mode == PATTERN_MODE_NORMAL && other->mode == PATTERN_MODE_NORMAL)
    {
      h->pattern_time_ms = other->pattern_time_ms;
    }
  }
  if (turn_signal)
  {
    pattern_turn_signal_headlight(h, time_ms, 1);
  }
  else
  {
    pattern_rows_headlight(h, h->pattern_time_ms);
    pattern_loop_analog_headlight(h, h->pattern_time_ms);
  }
}

void headlight_show(headlight_t *h, uint8_t side)
{
  for (int i = 0; i < LED_BUFFER_SIZE; ++i)
    set_led_color_side(side, i, h->led_buffer[i]);
  set_analog_led_side(side, h->analog_brightness);
}

// In your main loop, update sync_time_ms only if both turn signals are off:
// Example:
// if (!turn_signal_left_is_active() && !turn_signal_right_is_active()) {
//     sync_time_ms += 20;
// }
