#include "patterns.h"
#include "turn_signal.h"
#include "led_color.h"
#include "led_layout.h"
#include "headlight.h"
#include <stdint.h>
#include <math.h>

#define NUM_SIDES 2
#define SIDE_LEFT 0
#define SIDE_RIGHT 1

// Helper: interpolate between yellow and orange
static rgb_t lerp_yellow_orange(float t)
{
  rgb_t c;
  c.r = 255;
  c.g = (uint8_t)(200.0f * (1.0f - t) + 120.0f * t);
  c.b = 0;
  return c;
}

pattern_mode_t current_pattern_mode = PATTERN_MODE_NORMAL;

void reset_patterns(void)
{
  // Turn off all LEDs in both groups
  for (int row = 0; row < NUM_ROWS; ++row)
    for (int i = 0; i < LEDS_PER_ROW; ++i)
      set_led_color(row_indices[row][i], (rgb_t){0, 0, 0});
  for (int i = 0; i < LOOP_LEDS; ++i)
    set_led_color(loop_indices[i], (rgb_t){0, 0, 0});
  set_analog_led(0);
}

void led_update(uint32_t time_ms)
{
  static pattern_mode_t prev_mode[NUM_SIDES] = {PATTERN_MODE_NORMAL, PATTERN_MODE_NORMAL};
  uint8_t turn_signal[NUM_SIDES] = {turn_signal_left_is_active(), turn_signal_right_is_active()};
  pattern_mode_t new_mode[NUM_SIDES];
  for (int side = 0; side < NUM_SIDES; ++side)
  {
    new_mode[side] = turn_signal[side] ? PATTERN_MODE_TURN_SIGNAL : PATTERN_MODE_NORMAL;
    if (new_mode[side] != prev_mode[side])
    {
      reset_patterns_side(side);
      prev_mode[side] = new_mode[side];
    }
    if (turn_signal[side])
    {
      pattern_turn_signal_side(side, time_ms, 1);
    }
    else
    {
      pattern_rows_side(side, time_ms);
      pattern_loop_analog_side(side, time_ms);
    }
  }
}

void pattern_rows(uint32_t time_ms)
{
  float speed = 0.001f;
  for (int diag = 0; diag < LEDS_PER_ROW; ++diag)
  {
    float t = 0.5f * (1.0f + sinf(speed * time_ms + diag));
    rgb_t color = lerp_yellow_orange(t);
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      int led_idx = row_indices[row][LEDS_PER_ROW - 1 - diag];
      set_led_color(led_idx, color);
    }
  }
  for (int diag = 1; diag < LEDS_PER_ROW; ++diag)
  {
    float t = 0.5f * (1.0f + sinf(speed * time_ms + diag + 0.5f));
    rgb_t color = lerp_yellow_orange(t);
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      int led_idx = row_indices[row][LEDS_PER_ROW - diag];
      set_led_color(led_idx, color);
    }
  }
}

void pattern_loop_analog(uint32_t time_ms)
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
    set_led_color(loop_indices[i], color);
  }
  uint8_t analog_brightness = (progress < 0.5f) ? (uint8_t)(progress * 2.0f * 255.0f) : (uint8_t)((1.0f - progress) * 2.0f * 255.0f);
  set_analog_led(analog_brightness);
}

void pattern_turn_signal(uint32_t time_ms, uint8_t active)
{
  static uint8_t prev_active = 0;
  static uint32_t last_tick = 0;
  static const rgb_t orange = {255, 120, 0};
  if (!active)
  {
    if (prev_active)
    {
      for (int row = 0; row < NUM_ROWS; ++row)
        for (int i = 0; i < LEDS_PER_ROW; ++i)
          set_led_color(row_indices[row][i], (rgb_t){0, 0, 0});
      prev_active = 0;
      last_tick = 0;
    }
    return;
  }
  if (!prev_active)
  {
    for (int row = 0; row < NUM_ROWS; ++row)
      for (int i = 0; i < LEDS_PER_ROW; ++i)
        set_led_color(row_indices[row][i], (rgb_t){0, 0, 0});
    last_tick = time_ms;
  }
  prev_active = 1;
  float speed = 0.003f;
  float cycle = fmodf((time_ms - last_tick) * speed, 2.0f);
  int led_count = (int)(LEDS_PER_ROW * cycle);
  if (cycle < 1.0f)
  {
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      for (int i = 0; i < led_count && i < LEDS_PER_ROW; ++i)
        set_led_color(row_indices[row][i], orange);
      for (int i = led_count; i < LEDS_PER_ROW; ++i)
        set_led_color(row_indices[row][i], (rgb_t){0, 0, 0});
    }
  }
  else
  {
    int off_count = led_count - LEDS_PER_ROW;
    for (int row = 0; row < NUM_ROWS; ++row)
    {
      for (int i = 0; i < off_count && i < LEDS_PER_ROW; ++i)
        set_led_color(row_indices[row][i], (rgb_t){0, 0, 0});
      for (int i = off_count; i < LEDS_PER_ROW; ++i)
        set_led_color(row_indices[row][i], orange);
    }
  }
}