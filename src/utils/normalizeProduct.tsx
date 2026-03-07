export const normalizeProduct = (product: any) => {
  // Case 1: already an object
  if (product && !Array.isArray(product)) {
    return product;
  }

  // Case 2: array -> pick first item
  if (Array.isArray(product) && product.length > 0) {
    return product[0];
  }

  return null;
};
