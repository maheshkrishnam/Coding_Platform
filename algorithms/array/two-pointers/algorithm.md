# Two Pointers

The "Two Pointers" technique is a common algorithmic strategy used to solve problems involving arrays and linked lists. It uses two pointers that move through the data structure at the same time or at different speeds.

This technique is often used in problems that involve searching pairs or subarrays that satisfy a given condition. Some of the most common applications of the Two Pointers technique include:
- Pair Sum
- Removing duplicates from sorted arrays
- Subarray sum problems
- Reversing a portion of an array
- Sliding window problems

## Example Problem: Pair Sum
Given a sorted array, find two numbers that add up to a given sum.

### Approach:
1. Place one pointer at the beginning (`start`) and the other at the end (`end`) of the array.
2. If the sum of the elements at both pointers is equal to the target, return the pair.
3. If the sum is smaller than the target, move the `start` pointer to the right.
4. If the sum is greater than the target, move the `end` pointer to the left.

### Time Complexity: O(n)
