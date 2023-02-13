@ Your first program
.global _start

@ you can put an array of data into memory here if you want
.data
@ as an example: the values [1,2,3,4] will be sequentially stored in memory as bytes
my_array: .byte 1, 2, 3, 4

@ now start the code
.text
_start:

	@ initialize registers here as necessary
	
@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ START OF MAIN PROGRAM @@	
_main_loop:

	@ put main code here
	@ you can call a subroutine using code like this:
	@ bl <subroutine_name>
	
	
	@ loop endlessly
	b _main_loop
@@@ END OF MAIN PROGRAM @@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@	


@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@ START OF SUBROUTINES @@@	
_display_hex:
	@ put code to display value on hex display here
	
	@@@ a trick for getting the hex code for a digit:
	@@@
	@@@ you can access an element of an array using offsets
	@ ldrb r0, [r1, #5]
	@@@ if array base address is in r1, this accesses the 5th byte of the array
	@@@ note that the offset can even be a register
	@ ldrb r0, [r1, r2]
	@@@ this accesses the nth byte in array at r1, where n is in register r2
	@@@
	@@@ if you don't understand this trick, then there are other ways to do it
	@@@ a lot of compare statements, for example
	@ cmp r1, #0
	@ moveq r2, [code for displaying #0 on hex display]
	@@@ etc.	
	
	@ return from subroutine
	bx lr
	
_read_switches:
	@ put code to read from switches here
	
	@ return from subroutine
	bx lr
@@@ END OF SUBROUTINES @@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@
	

@ labels for constants and addresses
LED_BASE:		.word	0xFF200000
HEX3_HEX0_BASE:	.word	0xFF200020
SW_BASE:		.word	0xFF200040
@ feel free to add more if necessary
@ for example, if you put an array in the .data block above,
@ find the address of that array here
my_array_adr:	.word    my_array