#ifndef LED_COLOR_H
#define LED_COLOR_H

#include <stdint.h>

typedef struct
{
  uint8_t r;
  uint8_t g;
  uint8_t b;
} rgb_t;

// Set a single addressable LED (to be implemented for your LED driver)
void set_led_color(uint8_t idx, rgb_t color);

// Set the analog LED (to be implemented for your analog output)
void set_analog_led(uint8_t brightness); // 0-255

#endif // LED_COLOR_H
