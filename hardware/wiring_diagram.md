# Wiring Diagram (Markup)

Below is a markup representation of the wiring for the STM32F103C8T6 DRL controller (SK6812RGBW + analog LED):

```mermaid
graph TD
    STM32[STM32F103C8T6]
    SK6812[DRL - SK6812RGBW Addressable LEDs]
    ANALOG[DRL - Analog LED]
    MOSFET[IRLZ44N MOSFET]
    VIN[12V Car Power]
    REG5V[5V Regulator]
    GND[Ground]

    VIN --> REG5V
    REG5V --> SK6812
    REG5V --> STM32
    STM32 -- PA7 (SPI) --> SK6812
    STM32 -- PA8 (PWM) --> ANALOG
    VIN --> MOSFET
    STM32 -- GPIO --> MOSFET
    MOSFET --> ANALOG
    STM32 --- GND
    SK6812 --- GND
    ANALOG --- GND
    REG5V --- GND
    VIN --- GND
```

## Resistor Placement
- **Data line (PA7 to SK6812):** Place a 330Ω resistor in series to the data input of the first SK6812 LED. This helps protect against voltage spikes and reflections.
- **Analog LED (MOSFET drain to LED cathode):** Use a current-limiting resistor sized for your LED and supply voltage. For a 5V supply and typical yellow/orange LED (2V forward voltage, 20mA):
  - R = (5V - 2V) / 0.02A = 150Ω (use 150Ω or 180Ω for safety)
- **Capacitor:** Place a 470uF or larger electrolytic capacitor across 5V and GND near the SK6812 power input to prevent brownouts.

> For a detailed schematic, use a tool like KiCad or EasyEDA.
