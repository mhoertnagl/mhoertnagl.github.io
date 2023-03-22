---
layout: article
title: µ Unit - A unit testing framework for C
synopsis: I recently came across an article that implemented a minimalist unit testing framework for C. I was working on some C project and in need of a unit testing framework myself. Inspired by this apparent simplicity, I ventured to implement a testing framework of my own.
date: 2023-03-22
tags: 
  - C
  - uint-testing
---

I recently came across [this](https://jera.com/techinfo/jtns/jtn002) interesting article that implemented a minimalist unit testing framework for C. I was working on some C projects myself and in need of a unit testing framework. Inspired by this apparent simplicity, I ventured to implement a testing framework of my own.

## mu.h

The unit testing framework should be minimalist but provide a convenient DSL and readable testing results on the console. Leveraging the power of C macros, the entire framework can be defined in a single header file `mh.h`. The entire file is rather short and presented here in its entirety.

```c
// mu.h - Minimalist unit testing framework.
// Copyright (C) 2023  Mathias Hörtnagl <mathias.hoertnagl[ÄT]gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

#ifndef MU_H
#define MU_H

#include <stdio.h>
#include <string.h>

// clang-format off

typedef struct
{
  int tests_run;
  int tests_failed;
} Mu;

/**
 * Defines a standalone unit test program.
 * 
 * @param body The body block containing 
 *             the unit tests. 
 */
#define mu_unit(body)                                                        \
int main()                                                                   \
{                                                                            \
  Mu __mu__ = {                                                              \
    .tests_run    = 0,                                                       \
    .tests_failed = 0                                                        \
  };                                                                         \
  printf("\n═══════════════════════════════════════════════════════════\n"); \
  printf(" µ Unit v1.2\n");                                                  \
  printf("───────────────────────────────────────────────────────────\n");   \
  printf(" Running file %s\n\n", __FILE__);                                  \
  body                                                                       \
  printf("───────────────────────────────────────────────────────────\n");   \
  if (__mu__.tests_failed == 0) {                                            \
    printf(                                                                  \
      " PASSED %d TESTS\n",                                                  \
      __mu__.tests_run                                                       \
    );                                                                       \
  } else {                                                                   \
    printf(                                                                  \
      " FAILED %d of %d TESTS\n",                                            \
      __mu__.tests_failed,                                                   \
      __mu__.tests_run                                                       \
    );                                                                       \
  }                                                                          \
  printf("═══════════════════════════════════════════════════════════\n\n"); \
  return 0;                                                                  \
}

/**
 * Defines a single unit test.
 * 
 * @param name The name of the unit test.
 * @param body The test function body block. 
 */
#define test(name, body)        \
  {                             \
    int fails = 0;              \
    printf(" ▶ %s\n", name);    \
    body                        \
    if (fails == 0) {           \
      printf("   🗹  OK\n\n");  \
    } else {                    \
      printf("   ⬜ FAIL\n\n"); \
    }                           \
    __mu__.tests_run++;         \
  }                

/**
 * Asserts that the test condition is true or prints the 
 * failing message if the condition is not satisfied.
 * 
 * @param test     The test condition.
 * @param __format The failing message template.
 * @param args     Optional template arguments.
 */
#define assert(test, __format, args...)                 \
  if (!(test)) {                                        \
    if (fails == 0) {                                   \
      __mu__.tests_failed++;                            \
    }                                                   \
    printf("    ▸ %d: "__format"\n", __LINE__, ##args); \
    fails++;                                            \
  }

/**
 * Asserts that the actual string is equal 
 * to the expected string or prints a fixed
 * message indicating the mismatch.
 * 
 * @param act The actual string.
 * @param exp The expected string.
 */
#define assert_str_equal(act, exp)       \
  assert(                                \
    !strcmp(exp, act),                   \
    "Expected string [%s] but got [%s]", \
    exp,                                 \
    act                                  \
  )

// clang-format on

#endif
```
Every µ unit test comprises three building blocks: `mu_unit`, `test` and `assert*`. `mu_unit` is a wrapper for each test file. Every independent test file contains only one `mu_unit` block which itself contains a arbitrary number of `test` blocks. Each `test` block then contains the testing logic and one ore more `assert*` statements.

## An example test file

The following test file is part of my `mnml-as` project and tests some aspects of the assembler symbol table. As a convention test files end in `*.test.c`. Every test is identified by a user defined descriptive string as championed in BDD. 

```c
// test/sym.test.c

#include "utils/mu.h"
#include "../src/sym/sym.h"

mu_unit({
  test("A new symbol table should be empty", {
    SymbolTable *table = new_symbol_table();
    assert(table->size == 0, "table size should be 0");
    free_symbol_table(table);
  });

  test("Adding a symbol should increase table size by one", {
    SymbolTable *table = new_symbol_table();
    add_symbol(table, "x", 42);
    assert(table->size == 1, "table size should be 1");
    free_symbol_table(table);
  });

  test("An added a symbol should be stored in the table", {
    SymbolTable *table = new_symbol_table();
    add_symbol(table, "x", 42);
    Symbol *sym = table->symbols[0];
    assert_str_equal(sym->name, "x");
    assert(sym->loc == 42, "location of first symbol should be 42");
    free_symbol_table(table);
  });

  test("An added symbol should be findable again", {
    SymbolTable *table = new_symbol_table();
    add_symbol(table, "x", 42);
    i32 loc = find_symbol(table, "x");
    assert(loc == 42, "'x' should have location 42");
    free_symbol_table(table);
  });

  test("Multiple added symbol should be findable again", {
    SymbolTable *table = new_symbol_table();
    add_symbol(table, "x0", 42);
    add_symbol(table, "x1", 43);
    add_symbol(table, "x2", 44);
    i32 loc2 = find_symbol(table, "x2");
    i32 loc0 = find_symbol(table, "x0");
    i32 loc1 = find_symbol(table, "x1");
    assert(loc2 == 44, "'x2' should have location 44");
    assert(loc1 == 43, "'x1' should have location 43");
    assert(loc0 == 42, "'x0' should have location 42");
    free_symbol_table(table);
  });

  test("A not added symbol should not be findable", {
    SymbolTable *table = new_symbol_table();
    add_symbol(table, "x", 42);
    i32 loc = find_symbol(table, "y");
    assert(loc == -1, "'y' should not be in the table");
    free_symbol_table(table);
  });
})
```

Of course the user can define as many unit test files as desired. 

## Running the tests

With some additional Makefile magic, we can run the tests with a single command. The example Makefile again taken from `mnml-as` collects all object files into a single build directory. Besides the main executable it generates an executable for each test file and executes them immediately.

```makefile
CC = clang
CFLAGS = -std=c17 -g -Wall

# Binary
#------------------------------------------------------------------------------
# Binary target name.
TARGET = mnml-as

# Binary source root directory.
SRC_DIR = ./src
# Binary build root directory.
OUT_DIR = ./build
# Subdirectory for all source object files.
OBJ_DIR = $(OUT_DIR)/obj

# Binary source library dependencies.
LIBS +=
# Binary source header file dependencies.
DEPS += -I$(SRC_DIR)

# Unit testing
#------------------------------------------------------------------------------
# Unit tests source root directory.
TST_SRC_DIR = ./test
# Unit tests build root directory.
TST_OUT_DIR = ./build/tests
# Subdirectory for all unit test object files.
TST_OBJ_DIR = $(TST_OUT_DIR)/obj

# Unit tests library dependencies.
TST_LIBS +=
# Unit tests header file dependencies.
TST_DEPS += -I$(TST_SRC_DIR)

#------------------------------------------------------------------------------
# DO NOT EDIT BELOW THIS LINE
#------------------------------------------------------------------------------
INC = $(shell find $(SRC_DIR) -name '*.h')
SRC = $(shell find $(SRC_DIR) -name '*.c')
OBJ = $(patsubst $(SRC_DIR)/%, $(OBJ_DIR)/%, $(SRC:.c=.o))

TST_INC = $(shell find $(TST_SRC_DIR) -name '*.h')
TST_SRC = $(shell find $(TST_SRC_DIR) -name '*.c')
# Exclude binary main object file.
NMM_OBJ = $(filter-out %main.o, $(OBJ)) 
TST_OBJ = $(patsubst $(TST_SRC_DIR)/%, $(TST_OBJ_DIR)/%, $(TST_SRC:.c=.o))
# Exclude unit test main object files.
NMM_TST_OBJ = $(filter-out %.test.o, $(TST_OBJ)) 
# Gather all unit test files. 
# All files with *.test.c are considered unit test files.
TST_TARGETS = $(patsubst $(TST_SRC_DIR)/%.test.c, $(TST_OUT_DIR)/%.test, $(TST_SRC))

# Creates the binary.
all: $(TARGET)

# Cleans the build directory then rebuilds the binary.
remake: clean all

$(TARGET): $(OBJ)
	$(CC) $(CFLAGS) $(LIBS) $^ -o $(OUT_DIR)/$@

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c $(INC) 
	@mkdir -p $(dir $@)
	$(CC) -c $(CFLAGS) $(LIBS) $(DEPS) $< -o $@

# Run all unit tests.
test: clean $(TST_TARGETS)

$(TST_OUT_DIR)/%.test: $(NMM_OBJ) $(NMM_TST_OBJ) $(TST_OBJ_DIR)/%.test.o
	$(CC) $(CFLAGS) $(LIBS) $(TST_LIBS) $^ -o $@
	$@

$(TST_OBJ_DIR)/%.o: $(TST_SRC_DIR)/%.c $(INC) $(TST_INC)
	@mkdir -p $(dir $@)
	$(CC) -c $(CFLAGS) $(LIBS) $(TST_LIBS) $(DEPS) $(TST_DEPS) $< -o $@

# Full clean. 
# Removes the build directory.
clean:
	@rm -rf $(OUT_DIR)

.PHONY: clean
```

## The result

I put considerable effort into the actual test results output. It lists all tests in order of definition. There is no randomization of the execution order. Every failed assertion prints the line number and the corresponding message.


```sh
make test
...

═══════════════════════════════════════════════════════════
 µ Unit v1.2
───────────────────────────────────────────────────────────
 Running file test/sym.test.c

 ▶ A new symbol table should be empty
   🗹 OK

 ▶ Adding a symbol should increase table size by one
   🗹 OK

 ▶ An added a symbol should be stored in the table
    ▸ 22: Expected string [y] but got [x]
    ▸ 23: location of first symbol should be 42
   ⬜ FAIL

 ▶ An added symbol should be findable again
   🗹 OK

 ▶ Multiple added symbol should be findable again
    ▸ 45: 'x0' should have location 42
   ⬜ FAIL

 ▶ A not added symbol should not be findable
   🗹 OK

───────────────────────────────────────────────────────────
 FAILED 2 of 6 TESTS
═══════════════════════════════════════════════════════════
```

Sweet! 
