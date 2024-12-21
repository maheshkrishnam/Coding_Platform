#include <iostream>
#include <vector>
using namespace std;

vector<int> computeLPSArray(const string &pattern) {
  int m = pattern.size();
  vector<int> lps(m, 0);
  int length = 0; // length of previous longest prefix suffix
  int i = 1;

  while (i < m) {
    if (pattern[i] == pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length != 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

void KMPSearch(const string &text, const string &pattern) {
  vector<int> lps = computeLPSArray(pattern);
  int n = text.size();
  int m = pattern.size();
  int i = 0, j = 0;

  while (i < n) {
    if (pattern[j] == text[i]) {
      i++;
      j++;
    }
    if (j == m) {
      cout << "Found pattern at index " << i - j << endl;
      j = lps[j - 1];
    } else if (i < n && pattern[j] != text[i]) {
      if (j != 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
}

int main() {
  string text = "ABABDABACDABABCABAB";
  string pattern = "ABABCABAB";
  KMPSearch(text, pattern);
  return 0;
}
