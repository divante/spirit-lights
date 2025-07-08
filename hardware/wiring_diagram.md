# Wiring Diagram (Markup)

Below is a markup representation of the wiring for the STM32F103C8T6 DRL controller (SK6812RGBW + analog LED, dual mirrored headlights):

```mermaid
graph TD
    STM32[STM32F103C8T6]
    SK6812L[Left DRL - SK6812RGBW Addressable LEDs]
    ANALOG_L[Left DRL - Analog LED]
    MOSFET_L[IRLZ44N MOSFET (Left)]
    SK6812R[Right DRL - SK6812RGBW Addressable LEDs]
    ANALOG_R[Right DRL - Analog LED]
    MOSFET_R[IRLZ44N MOSFET (Right)]
    VIN[12V Car Power]
    REG5V[5V Regulator]
    GND[Ground]

    VIN --> REG5V
    REG5V --> SK6812L
    REG5V --> SK6812R
    REG5V --> STM32
    STM32 -- PA7 (SPI) --> SK6812L
    STM32 -- PB5 (SPI2) --> SK6812R
    STM32 -- PA8 (PWM) --> ANALOG_L
    STM32 -- PB6 (PWM) --> ANALOG_R
    VIN --> MOSFET_L
    VIN --> MOSFET_R
    STM32 -- GPIO --> MOSFET_L
    STM32 -- GPIO --> MOSFET_R
    MOSFET_L --> ANALOG_L
    MOSFET_R --> ANALOG_R
    STM32 --- GND
    SK6812L --- GND
    SK6812R --- GND
    ANALOG_L --- GND
    ANALOG_R --- GND
    REG5V --- GND
    VIN --- GND
```

## Resistor Placement
- **Data line (PA7 to SK6812L, PB5 to SK6812R):** Place a 330Ω resistor in series to the data input of the first SK6812 LED on each side.
- **Analog LED (MOSFET drain to LED cathode):** Use a current-limiting resistor sized for your LED and supply voltage. For a 5V supply and typical yellow/orange LED (2V forward voltage, 20mA):
  - R = (5V - 2V) / 0.02A = 150Ω (use 150Ω or 180Ω for safety)
- **Capacitor:** Place a 470uF or larger electrolytic capacitor across 5V and GND near each SK6812 power input to prevent brownouts.

> For a detailed schematic, use a tool like KiCad or EasyEDA.
