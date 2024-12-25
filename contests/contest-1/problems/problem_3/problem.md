### Problem 3: Reverse Integer

#### Description:
Given an integer `x`, return its reversed digits as an integer. If reversing `x` causes the value to go outside the range of a 32-bit signed integer, return 0.

Assume the environment does not allow you to store 64-bit integers, so the reversed integer must fit within the 32-bit signed integer range.

#### Input:
- The first line contains an integer `t` (1 <= t <= 100), the number of test cases.
- For each test case:
  1. An integer `x` (-2^31 <= x <= 2^31 - 1) representing the number to reverse.

#### Output:
For each test case, output the reversed integer. If the reversed integer goes beyond the 32-bit signed integer range, output 0.

#### Constraints:
- `-2^31 <= x <= 2^31 - 1`
- The reversed integer should be within the 32-bit signed integer range (-2^31 to 2^31 - 1).
