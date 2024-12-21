# Knuth-Morris-Pratt (KMP) Algorithm

The KMP algorithm is an efficient string searching (or substring searching) algorithm that searches for occurrences of a word within a main text string. It improves on the brute force approach by avoiding unnecessary re-examinations of characters.

### Approach:
1. Preprocess the pattern to create a "partial match" table (or LPS array).
2. Use the table to skip characters that have already been matched.

### Time Complexity: O(n + m)
- n = length of the text
- m = length of the pattern
