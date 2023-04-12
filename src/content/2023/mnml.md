---
layout: article
title: mnml - An Educational Minimal Computing System
synopsis: There is something magical about computing. Implementing an educational computing system from scratch provides ample opportunity to dabble in design minimalism. mnml is a virtual stack machine plus an assembler stripped to the bones.
date: 2023-04-06
tags: 
  - c
  - vm
  - assembler
draft: true
---
There is something magical about computing. Implementing an educational computing system from scratch provides ample opportunity to dabble in design minimalism. mnml is a virtual stack machine plus an assembler stripped to the bones.

## The Virtual Machine

mnml is a 16bit virtual stack machine with a whopping 64k of addressable memory. The instruction set is lavish and redundant but I will slim it down as soon as I gained some insights on the utility of each instruction. Of course `OISC` would be enough, but my aim is to strike a balance between simplicity and practicality.

The following table lists the stack manipulation instructions:

| Instruction | Stack before | Stack after | Effect                                                |
| ----------- | ------------ | ----------- | ----------------------------------------------------- |
| psh n       | ..           | n ..        | Push the next two bytes in the binary onto the stack. |
| pop         | x ..         |             | Removes the top element from the stack.               |
| nip         | x y ..       | x ..        | Removes the second element from the stack.            |
| dup         | x ..         | x x ..      | Push a copy of the first element onto the stack.      |
| ovr         | x y ..       | y x y ..    | Push a copy of the second element onto the stack.     |
| swp         | x y ..       | y x ..      | Swap the first and the second element.                |
| rot         | x y z ..     | y z x ..    | Rotate the first three elements.                      |

Most of these operations follow a pattern. `nip` is the logical extension to `pop`. Instead of the top element, we remove the second element without touching the top element. `dup` duplicates to top element, while `ovr` duplicates the second element. Finally, `swp` is the 2-element rotation, whereas `rot` is the corresponding 3-element rotation. Each of these pairs suggest a generalization where some of the op-code bits encode the position of the element to be deleted, copied, or the number of elements to be rotated.  

The arithmetic instructions contain the two superfluous operations `inc` and `dec`:

| Instruction | Stack before | Stack after | Effect                                      |
| ----------- | ------------ | ----------- | ------------------------------------------- |
| inc         | x ..         | (x+1) ..    | Increase the top element by one.            |
| dec         | x ..         | (x-1) ..    | Decrease the top element by one.            |
| add         | x y ..       | (y+x) ..    | Add the top two elements.                   |
| sub         | x y ..       | (y-x) ..    | Subtract the first element from the second. |
| mul         | x y ..       | (y*x) ..    | Multiply the top two elements.              |
| div         | x y ..       | (y/x) ..    | Divide the second element by the first.     |

`inc` and `dec` are rather limited in their utility. Iterating through memory locations already requires doublets of `inc | inc` or`dec | dec`. `psh 2 | add` is equivalent but is double the size. Anyway, these two instructions are likely candidates for removal.

Next, consider the logic operations:

| Instruction | Stack before | Stack after | Effect                                                                                      |
| ----------- | ------------ | ----------- | ------------------------------------------------------------------------------------------- |
| not         | x ..         | !x ..       | Negate top stack element.                                                                   |
| and         | x y ..       | (y&x) ..    | Logical AND of the two topmost stack entries.                                               |
| oor         | x y ..       | (y\|x) ..   | Logical OR of the two topmost stack entries.                                                |
| xor         | x y ..       | (y^x) ..    | Logical XOR of the two topmost stack entries.                                               |
| sll         | x y ..       | (y<<x) ..   | Logical left shift the second element by the number of bit specified by the first element.  |
| srl         | x y ..       | (y>>x) ..   | Logical right shift the second element by the number of bit specified by the first element. |

`sll` and `srl` can be emulated with `mul` and `div`. Arithmetic shift is missing completely but again can be emulated with `div`. 

| Instruction | Effect                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| equ         | Push 1 on the stack iff the top two elements are equal.                                              |
| neq         | Push 1 on the stack iff the top two elements are not equal.                                          |
| slt         | Push 1 on the stack iff the top if the second element is less than the first element.                |
| sgt         | Push 1 on the stack iff the top if the second element is greater than the first element.             |
| sle         | Push 1 on the stack iff the top if the second element is less than or equal to the first element.    |
| sge         | Push 1 on the stack iff the top if the second element is greater than or equal to the first element. |

Some of these can be emulated with a swap and the dual comparison operation.

| Instruction | Stack before | Stack after | Effect                                                                                       |
| ----------- | ------------ | ----------- | -------------------------------------------------------------------------------------------- |
| jmp         | a ..         | ..          | Unconditional jump to location in first element `PC = a`.                                    |
| jal         | a ..         | (PC+1) ..   | Unconditional jump to location in first element and push return address onto stack `PC = a`. |
| bra         | a c ..       | ..          | Branch to location in second element if first element is 1 `if c == 1 then PC = a`.          |

### Memory

Additionally there are two operations to load from and store to memory.

| Instruction | Stack before | Stack after | Effect                                      |
| ----------- | ------------ | ----------- | ------------------------------------------- |
| ldw         | a ..         | MEM[a] ..   | Load 16bit word from memory onto the stack. |
| stw         | a v ..       | ..          | Store 16bit word to memory `MEM[a] = b`.    |

Words are stored big-endian. At start-up the VM sets the program counter `PC = 0` and the stack pointer `SP` to the end of memory.

### Devices

// Device concept

Two operations to receive data from and transfer data to devices. 

| Instruction | Effect            |
| ----------- | ----------------- |
| drx         | Read from device. |
| dtx         | Write to device.  |

## Assembler
