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

| Instruction | Effect                                                |
| ----------- | ----------------------------------------------------- |
| psh         | Push the next two bytes in the binary onto the stack. |
| pop         | Removes the top element from the stack.               |
| nip         | Removes the second element from the stack.            |
| dup         | Push a copy of the first element onto the stack.      |
| ovr         | Push a copy of the second element onto the stack.     |
| swp         | Swap the first and the second element.                |
| rot         | Rotate the first three elements.                      |

Most of these operations follow a pattern. `nip` is the logical extension to `pop`. Instead of the top element, we remove the second element without touching the top element. `dup` duplicates to top element, while `ovr` duplicates the second element. Finally, `swp` is the 2-element rotation, whereas `rot` is the corresponding 3-element rotation. Each of these pairs suggest a generalization where some of the op-code bits encode the position of the element to be deleted, copied, or the number of elements to be rotated.  

The arithmetic instructions contain the two superfluous operations `inc` and `dec`:

| Instruction | Effect                                      |
| ----------- | ------------------------------------------- |
| inc         | Increase the top element by one.            |
| dec         | Decrease the top element by one.            |
| add         | Add the top two elements.                   |
| sub         | Subtract the first element from the second. |
| mul         | Multiply the top two elements.              |
| div         | Divide the second element by the first.     |

`inc` and `dec` are rather limited in their utility. Iterating through memory locations already requires doublets of `inc | inc` or`dec | dec`. `psh 2 | add` is equivalent but is double the size. Anyway, these two instructions are likely candidates for removal.

Next, consider the logic operations:

| Instruction | Effect                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------- |
| not         | Negate top stack element.                                                                   |
| and         | Logical AND of the two topmost stack entries.                                               |
| oor         | Logical OR of the two topmost stack entries.                                                |
| xor         | Logical XOR of the two topmost stack entries.                                               |
| sll         | Logical left shift the second element by the number of bit specified by the first element.  |
| srl         | Logical right shift the second element by the number of bit specified by the first element. |

`sll` and `srl` can be emulated with `mul` and `div`. Arithmetic shift is missing completely but again can be emulated with `div`. `xor` is actually a special case of `neq` which is one of the comparison operations:

| Instruction | Effect                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| equ         | Push 1 on the stack iff the top two elements are equal.                                              |
| neq         | Push 1 on the stack iff the top two elements are not equal.                                          |
| slt         | Push 1 on the stack iff the top if the second element is less than the first element.                |
| sgt         | Push 1 on the stack iff the top if the second element is greater than the first element.             |
| sle         | Push 1 on the stack iff the top if the second element is less than or equal to the first element.    |
| sge         | Push 1 on the stack iff the top if the second element is greater than or equal to the first element. |

Some of these can be emulated with a swap and the dual comparison operation.

| Instruction | Effect                                                                              |
| ----------- | ----------------------------------------------------------------------------------- |
| jmp         | Unconditional jump to location is first element.                                    |
| jal         | Unconditional jump to location is first element and push return address onto stack. |
| bra         | Branch to location in second element if first element is 1.                         |

Additionally there are two operations to load from and store to memory...

| Instruction | Effect                                      |
| ----------- | ------------------------------------------- |
| ldw         | Load 16bit word from memory onto the stack. |
| stw         | Store 16bit word to memory.                 |

... as well as two operations to receive data from and transfer data to devices. 

| Instruction | Effect            |
| ----------- | ----------------- |
| drx         | Read from device. |
| dtx         | Write to device.  |

// Devices
