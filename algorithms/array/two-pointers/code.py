def find_pair_with_sum(arr, target):
    start, end = 0, len(arr) - 1
    while start < end:
        total = arr[start] + arr[end]
        if total == target:
            return (arr[start], arr[end])
        elif total < target:
            start += 1
        else:
            end -= 1
    return None  # No pair found

arr = [1, 2, 3, 4, 6, 8, 10]
target = 10
result = find_pair_with_sum(arr, target)
if result:
    print(f"Pair found: {result[0]}, {result[1]}")
else:
    print("No pair found.")
