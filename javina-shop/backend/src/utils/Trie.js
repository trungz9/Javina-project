// backend/src/utils/Trie.js

class TrieNode {
  constructor() {
    this.children = {}      // các ký tự con
    this.isEnd   = false    // đánh dấu kết thúc từ
    this.products = []      // lưu sản phẩm tại node này
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  // ── INSERT: thêm tên sản phẩm vào Trie ──────────────
  insert(productName, productId) {
    const word = this.normalize(productName)
    let node = this.root

    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode()
      }
      node = node.children[char]
      // Lưu productId ở mọi node trên đường đi
      // để tìm kiếm prefix nhanh hơn
      if (!node.products.includes(productId)) {
        node.products.push(productId)
      }
    }
    node.isEnd = true
  }

  // ── SEARCH: tìm gợi ý theo prefix ───────────────────
  search(prefix, limit = 10) {
    const word = this.normalize(prefix)
    let node = this.root

    for (const char of word) {
      if (!node.children[char]) {
        return [] // không tìm thấy prefix
      }
      node = node.children[char]
    }

    // Trả về danh sách productId tìm được
    return node.products.slice(0, limit)
  }

  // ── NORMALIZE: chuẩn hóa tiếng Việt ─────────────────
  normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')                    // tách dấu
      .replace(/[\u0300-\u036f]/g, '')     // xóa dấu
      .replace(/đ/g, 'd')
      .trim()
  }
}

// Export singleton — dùng chung 1 instance toàn app
export const trie = new Trie()