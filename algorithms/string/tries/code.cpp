#include <iostream>
#include <unordered_map>
using namespace std;

class TrieNode {
public:
  unordered_map<char, TrieNode *> children;
  bool isEndOfWord;
  TrieNode() : isEndOfWord(false) {}
};

class Trie {
private:
  TrieNode *root;

public:
  Trie() {
    root = new TrieNode();
  }

  void insert(const string &word) {
    TrieNode *node = root;
    for (char c : word) {
      if (node->children.find(c) == node->children.end()) {
        node->children[c] = new TrieNode();
      }
      node = node->children[c];
    }
    node->isEndOfWord = true;
  }

  bool search(const string &word) {
    TrieNode *node = root;
    for (char c : word) {
      if (node->children.find(c) == node->children.end()) {
        return false;
      }
      node = node->children[c];
    }
    return node->isEndOfWord;
  }
};

int main() {
  Trie trie;
  trie.insert("hello");
  trie.insert("world");
  cout << (trie.search("hello") ? "Found" : "Not Found") << endl;
  cout << (trie.search("word") ? "Found" : "Not Found") << endl;
  return 0;
}
