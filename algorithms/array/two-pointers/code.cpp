#include <iostream>
#include <vector>
using namespace std;

pair<int, int> findPairWithSum(vector<int> &arr, int target) {
  int start = 0, end = arr.size() - 1;
  while (start < end) {
    int sum = arr[start] + arr[end];
    if (sum == target) {
      return {arr[start], arr[end]};
    } else if (sum < target) {
      start++;
    } else {
      end--;
    }
  }
  return {-1, -1}; // No pair found
}

int main() {
  vector<int> arr = {1, 2, 3, 4, 6, 8, 10};
  int target = 10;
  auto result = findPairWithSum(arr, target);
  if (result.first != -1) {
    cout << "Pair found: " << result.first << ", " << result.second << endl;
  } else {
    cout << "No pair found." << endl;
  }
  return 0;
}
