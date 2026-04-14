export const CATEGORIES = {
  Electronics: { label: '电子产品', value: 'Electronics' },
  Clothing: { label: '服装配饰', value: 'Clothing' },
  Food: { label: '食品饮料', value: 'Food' },
  Books: { label: '图书', value: 'Books' },
  Shoes: { label: '鞋靴', value: 'Shoes' },
  Accessories: { label: '配饰', value: 'Accessories' }
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const CATEGORY_MAP = {
  // PascalCase keys (from backend/database)
  'Electronics': '电子产品',
  'Clothing': '服装配饰',
  'Food': '食品饮料',
  'Books': '图书',
  'Shoes': '鞋靴',
  'Accessories': '配饰',
  // lowercase keys (for frontend filters)
  'electronics': '电子产品',
  'clothing': '服装配饰',
  'food': '食品饮料',
  'books': '图书',
  'shoes': '鞋靴',
  'accessories': '配饰'
};

export function getCategoryLabel(category) {
  return CATEGORY_MAP[category] || category || '全部分类';
}