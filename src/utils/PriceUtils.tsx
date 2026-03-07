export const calculateMRP = (price: string | number, discountPercentage: string | number) => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    let d = 0;

    if (typeof discountPercentage === 'string') {
        d = parseFloat(discountPercentage.replace('%', ''));
    } else {
        d = discountPercentage;
    }

    if (isNaN(p)) return "0";
    if (!d || d === 0 || isNaN(d)) return Math.round(p).toString();

    // MRP = Selling Price / (1 - Discount/100)
    const mrp = p / (1 - d / 100);
    return Math.round(mrp).toString();
};
