#include "stm32f1xx.h"
#include "turn_signal.h"

#define TURN_SIGNAL_GPIO_PORT GPIOA
#define TURN_SIGNAL_PIN GPIO_PIN_0

void turn_signal_init(void)
{
  // Configure GPIOA PIN0 as input (turn signal)
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN;
  TURN_SIGNAL_GPIO_PORT->CRL &= ~(0xF << (0 * 4));
  TURN_SIGNAL_GPIO_PORT->CRL |= (0x4 << (0 * 4)); // Input floating
}

uint8_t turn_signal_is_active(void)
{
  return (TURN_SIGNAL_GPIO_PORT->IDR & TURN_SIGNAL_PIN) ? 1 : 0;
}
