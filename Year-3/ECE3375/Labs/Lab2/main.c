#include "address_map_arm.h"
#include <stdio.h>

typedef struct Timer{
    int load;
    int count;
    int control;
    int status;
}Timer;

void DisplayHex(int value){
    int hundredth = value;
    int tenth = value/10;
    int sec = value/100;
    int tsec = value/1000;
    int min = value/6000;
    int tmin = value/60000;

    volatile int hex_code[10] = {0x3F,0x6,0x5B,0x4F,0x66,0x6D,0x7D,0x7,0x7F,0x67};
    volatile int * HEX_ptr = (int*) HEX3_HEX0_BASE; // Gets the Lower 4 Sigment Address as Hex
    volatile int * HEX_ptr2 = (int*) HEX5_HEX4_BASE; // Gets the other part of the Lower 4 Sigment Address as Hex

    int segDis1 = hex_code[hundredth - (tenth*10)] + (hex_code[tenth - (sec*10)]<<8)+ (hex_code[sec - (tsec*10)]<<16) + (hex_code[tsec - (min*6)]<<24);
    int segDis2 = hex_code[min - (tmin*10)] + (hex_code[tmin]<<8);

    *HEX_ptr = segDis1;
    *HEX_ptr2 = segDis2;
}

int ReadSwitch(void){
    volatile int * SW_ptr = (int *) SW_BASE;
    int swVal = *SW_ptr;
    return swVal;
}

int ReadBtn(void){
    volatile int * BTN_ptr = (int *)KEY_BASE;
    int btnVal = *BTN_ptr; 
    return btnVal;
}

int main(void){
    volatile Timer * const timer = (Timer*) MPCORE_PRIV_TIMER;

    volatile int interval = 2000000;
    timer -> load = interval;
    int counter;
    int stats;
    int lap = 0;
    int time = 0;
    
    while(1){
        int swVal = ReadSwitch();
        counter = timer->count;
        stats = timer-> status;

        if (swVal == 0){
            int action = ReadBtn();
            
            switch (action){
                // Start
                case 1:
                    timer->control = 3;
                    break; 
                
                // Stop
                case 2: 
                    timer->control = 2;
                    break;
                
                // Lap
                case 4: 
                    lap = time;
                    break;

                // Clear
                case 8:
                    timer->count = interval;
                    lap = 0;
                    time = 0;
                    break;

                default:
                    break;
            }
            DisplayHex(time);
        }

        else{
            DisplayHex(lap);
        }

        if (stats == 1){
            time++;
            timer->status = 1; 
        }
    }
}