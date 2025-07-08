// Main firmware source for STM32F103C8T6 DRL controller
// Handles addressable and non-addressable DRLs

#include "stm32f1xx.h"
#include "patterns.h"
#include "turn_signal.h"
#include "headlight.h"
#include <stdint.h>

void delay_ms(uint32_t ms)
{
  // Simple blocking delay (replace with HAL_Delay or timer in real code)
  for (volatile uint32_t i = 0; i < ms * 8000; ++i)
  {
  }
}

int main(void)
{
  // Initialize peripherals, GPIO, and LED drivers
  turn_signal_init();
  headlight_t left, right;
  headlight_init(&left);
  headlight_init(&right);
  uint32_t time_ms = 0;
  while (1)
  {
    uint8_t left_signal = turn_signal_left_is_active();
    uint8_t right_signal = turn_signal_right_is_active();
    // Sync pattern_time_ms if both are in normal mode
    if (!left_signal && !right_signal)
    {
      headlight_sync_pattern_time(&left, &right);
    }
    // Increment pattern_time_ms for each headlight in normal mode
    if (!left_signal)
      left.pattern_time_ms += 20;
    if (!right_signal)
      right.pattern_time_ms += 20;
    headlight_update(&left, &right, time_ms, left_signal);
    headlight_update(&right, &left, time_ms, right_signal);
    headlight_show(&left, SIDE_LEFT);
    headlight_show(&right, SIDE_RIGHT);
    leds_show();
    delay_ms(20);
    time_ms += 20;
  }
}
