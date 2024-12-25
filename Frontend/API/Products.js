const PRODUCT_API_URL = 'http://localhost:3000/products';

// ดึงข้อมูลสินค้าทั้งหมด
export const fetchProducts = async () => {
    const response = await fetch(PRODUCT_API_URL);
    return await response.json();
};

// ดึงข้อมูลสินค้าตาม ID
export const fetchProductById = async (id) => {
    const response = await fetch(`${PRODUCT_API_URL}/${id}`);
    return await response.json();
};

// สร้างสินค้าใหม่
export const createProduct = async (data) => {
    const response = await fetch(PRODUCT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await response.json();
};

// ลบสินค้า
export const deleteProduct = async (id) => {
    await fetch(`${PRODUCT_API_URL}/${id}`, { method: 'DELETE' });
};
