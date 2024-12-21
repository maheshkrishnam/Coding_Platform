# Bubble Sort

Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Algorithm Explanation:
1. Starting from the first element, compare the current element with the next element.
2. If the current element is greater than the next element, swap them.
3. Continue this process for the entire array. After each pass, the largest unsorted element will "bubble up" to its correct position.
4. Repeat the process for the remaining unsorted elements until the list is fully sorted.

### Time Complexity:
- Best case: O(n) when the array is already sorted (optimized version).
- Worst case: O(n^2) when the array is sorted in reverse order.
- Average case: O(n^2).

### Space Complexity:
- O(1), since Bubble Sort is an in-place sorting algorithm.

### Example:
For the array `[64, 34, 25, 12, 22, 11, 90]`, after applying Bubble Sort, the sorted array will be `[11, 12, 22, 25, 34, 64, 90]`.
