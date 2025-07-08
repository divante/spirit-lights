// Main firmware source for STM32F103C8T6 DRL controller
// Handles addressable and non-addressable DRLs

#include "stm32f1xx.h"
#include "patterns.h"
#include "turn_signal.h"
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
  uint32_t time_ms = 0;
  while (1)
  {
    led_update(time_ms);
    leds_show(); // Push buffer to hardware
    delay_ms(20);
    time_ms += 20;
  }
}
