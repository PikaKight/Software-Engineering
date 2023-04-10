#include "address_map_arm.h"
#include <stdio.h>

typedef struct _ADC{
    unsigned int c0;
    unsigned int c1;
    unsigned int c2;
    unsigned int c3;
    unsigned int c4;
    unsigned int c5;
    unsigned int c6;
    unsigned int c7;
} ADC;

int main(){
    volatile int * SW_ptr = (int*) SW_BASE;
    volatile ADC* const adc_ptr = (ADC*) ADC_BASE;
    volatile int * gpio_ptr = (int *) JP1_BASE;
    volatile int * gpioC_ptr = (int *) (JP1_BASE+4);

    *(gpioC_ptr) = 1023;
    *(gpio_ptr) = 0;

    int bit_mask = 1<<15;
    int adcData;
    (adc_ptr -> c1) = 1;

    while (1){
        int ch = *(SW_ptr);
        if ((adc_ptr->c0) &= bit_mask){
            if(ch == 0){
                adcData = adc_ptr -> c0;
            }
            else if (ch == 1){
                adcData = adc_ptr -> c1;
            }

            adcData = adcData - bit_mask;
            if (adcData >= 0 && adcData<= 400){
                *gpio_ptr = 0;
            }
            else if (adcData >= 1 && adcData<= 400){
                *gpio_ptr = 1;
            }   
            else if (adcData >= 400 && adcData<= 800){
                *gpio_ptr = 3;
            }  
            else if (adcData >= 800 && adcData<= 1200){
                *gpio_ptr = 7;
            }  
            else if (adcData >= 1200 && adcData<= 1600){
                *gpio_ptr = 15;
            }  
            else if (adcData >= 1600 && adcData<= 2000){
                *gpio_ptr = 31;
            }  
            else if (adcData >= 2000 && adcData<= 2400){
                *gpio_ptr = 63;
            }  
            else if (adcData >= 2400 && adcData<= 2800){
                *gpio_ptr = 63;
            }  
            else if (adcData >= 2800 && adcData<= 3200){
                *gpio_ptr = 127;
            }  
            else if (adcData >= 3200 && adcData<= 3300){
                *gpio_ptr = 255;
            }  
            else if (adcData >= 3300 && adcData<= 3700){
                *gpio_ptr = 511;
            }  
            else if (adcData>= 3700){
                *gpio_ptr = 1023;
            }  
        }
    }
     
}