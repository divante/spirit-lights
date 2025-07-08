#include "led_color.h"
#include "led_layout.h"
#include "stm32f1xx.h"
#include <string.h>

#define LED_BUFFER_SIZE TOTAL_ADDRESSABLE_LEDS

static rgb_t led_buffer[LED_BUFFER_SIZE];
static uint8_t analog_led_brightness = 0;

// Call this after all set_led_color/set_analog_led to update the hardware
void leds_show(void);

void set_led_color(uint8_t idx, rgb_t color)
{
  if (idx < LED_BUFFER_SIZE)
  {
    led_buffer[idx] = color;
  }
}

void set_analog_led(uint8_t brightness)
{
  analog_led_brightness = brightness;
}

// Call this once in main() before using set_analog_led
void analog_led_pwm_init(void)
{
  // Enable GPIOA and TIM1 clocks
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_TIM1EN;
  // Set PA8 (TIM1_CH1) to alternate function push-pull
  GPIOA->CRH &= ~(0xF << 0);
  GPIOA->CRH |= (0xB << 0); // 0xB = 1011: 50MHz, AF push-pull
  // Set TIM1 for PWM mode
  TIM1->PSC = 71;  // Prescaler: 72MHz/72 = 1MHz
  TIM1->ARR = 255; // 8-bit PWM
  TIM1->CCR1 = 0;  // Start off
  TIM1->CCMR1 &= ~TIM_CCMR1_OC1M;
  TIM1->CCMR1 |= (6 << 4); // PWM mode 1
  TIM1->CCER |= TIM_CCER_CC1E;
  TIM1->BDTR |= TIM_BDTR_MOE;
  TIM1->CR1 |= TIM_CR1_CEN;
}

// --- SK6812RGBW SPI Implementation ---
// Use SPI1 on PA7 (MOSI) at 3.0 Mbps
#define SK6812_SPI SPI1
#define SK6812_SPI_GPIO_PORT GPIOA
#define SK6812_SPI_MOSI_PIN GPIO_PIN_7
#define SK6812_SPI_AF 0x07
#define SK6812_SPI_BAUD 0x01 // fPCLK/4 for 72MHz -> 18MHz, but we use bit expansion for 3Mbps

// Each SK6812 bit is encoded as 3 SPI bits: 1 -> 110, 0 -> 100
static uint8_t spi_expand_bit(uint8_t bit)
{
  return bit ? 0b110 : 0b100;
}

// Call this once in main() before using leds_show
void sk6812_spi_init(void)
{
  // Enable GPIOA and SPI1 clocks
  RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_SPI1EN;
  // Set PA7 to AF push-pull
  SK6812_SPI_GPIO_PORT->CRL &= ~(0xF << (4 * 7 - 28));
  SK6812_SPI_GPIO_PORT->CRL |= (0xB << (4 * 7 - 28));
  // SPI1 config: master, 8-bit, CPOL=0, CPHA=0
  SK6812_SPI->CR1 = SPI_CR1_MSTR | SPI_CR1_SSM | SPI_CR1_SSI | (SK6812_SPI_BAUD << 3) | SPI_CR1_SPE;
}

static void sk6812_send_byte(uint8_t byte)
{
  for (int i = 7; i >= 0; --i)
  {
    uint8_t bits = spi_expand_bit((byte >> i) & 0x01);
    for (int b = 2; b >= 0; --b)
    {
      while (!(SK6812_SPI->SR & SPI_SR_TXE))
        ;
      SK6812_SPI->DR = (bits >> b) & 0x01 ? 0xFF : 0x00;
    }
  }
}

void leds_show(void)
{
  // Send SK6812 data (G, R, B, W for each LED)
  for (int i = 0; i < LED_BUFFER_SIZE; ++i)
  {
    sk6812_send_byte(led_buffer[i].g);
    sk6812_send_byte(led_buffer[i].r);
    sk6812_send_byte(led_buffer[i].b);
    sk6812_send_byte(0); // White channel (not used)
  }
  // Latch: >80us low (send 48+ zero bytes at 3Mbps)
  for (int i = 0; i < 48; ++i)
  {
    while (!(SK6812_SPI->SR & SPI_SR_TXE))
      ;
    SK6812_SPI->DR = 0x00;
  }
  // For analog, output analog_led_brightness to PA8 (TIM1_CH1)
  TIM1->CCR1 = analog_led_brightness;
}

void leds_clear(void)
{
  memset(led_buffer, 0, sizeof(led_buffer));
  analog_led_brightness = 0;
  leds_show();
}
