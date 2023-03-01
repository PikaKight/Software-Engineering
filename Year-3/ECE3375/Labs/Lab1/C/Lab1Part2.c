/* Your first program*/
#include "address_map_arm.h"


#define LED_BASE 0xFF200000
#define HEX3_HEX0_BASE 0xFF200020
#define SW_BASE 0xFF200040

volatile int DELAY_LEN;

void DisplayHex(int value)
{   
    // The hex output value of the 7-sigment display
    unsigned char segmentDisplay[16] = {0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x67, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71};

    // Sets the pointer to the lower 4 hex segment address
    volatile int *DISPLAY_ptr = (int *)HEX3_HEX0_BASE;
    *DISPLAY_ptr = segmentDisplay[value];

}

int ReadSwitches(void)
{
    // Switch address
    volatile int *SW_ptr = (int *)SW_BASE;

    unsigned int SW_val = *SW_ptr & 0x0F;
    return SW_val;
}

int main(void)
{
    // LED Address
    volatile int *LED_ptr = (int *)LED_BASE;

    // Sets a delay of length 700000
    DELAY_LEN = 700000;

    // Used to keep track of the delay
    volatile int delay_counter;

    // Used to keep track of the status
    volatile int status = 0;
    
    volatile int *DISPLAY_ptr = (int *)HEX3_HEX0_BASE;

    

    while (1){
        if (status == 0)
        {
            status = 1;
            *(LED_ptr) |= 0x1;
			DisplayHex(ReadSwitches());
        }
        else
        {
            status = 0;
            *(LED_ptr) &= ~0x1;
			*(DISPLAY_ptr) &= 0x00;
        }

        for (delay_counter = DELAY_LEN; delay_counter != 0; --delay_counter); // delay loop
    }
}
