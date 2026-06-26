/**
 * Calculate final price based on base price and selected weight.
 * @param {number} basePrice  - Product's listed price (for its default grams)
 * @param {number} weightGrams - Selected weight in grams (e.g. 250, 500, 750, 1000)
 * @returns {number} Final price rounded to nearest rupee
 */
export function calculatePrice(basePrice, weightGrams) {
  return Math.round((basePrice / 1000) * weightGrams)
}

/**
 * Available weight options with labels
 */
export const WEIGHT_OPTIONS = [
  { label: '250g',  grams: 250  },
  { label: '500g',  grams: 500  },
  { label: '750g',  grams: 750  },
  { label: '1 kg',  grams: 1000 },
]
