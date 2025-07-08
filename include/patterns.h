#ifndef PATTERNS_H
#define PATTERNS_H

#include <stdint.h>
#include "led_layout.h"

typedef enum
{
  PATTERN_MODE_NORMAL = 0,
  PATTERN_MODE_TURN_SIGNAL = 1
} pattern_mode_t;

void pattern_rows(uint32_t time_ms);
void pattern_loop_analog(uint32_t time_ms);
void pattern_turn_signal(uint32_t time_ms, uint8_t active);
void reset_patterns(void);

extern pattern_mode_t current_pattern_mode;

#endif // PATTERNS_H
