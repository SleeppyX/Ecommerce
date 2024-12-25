const ORDER_API_URL = 'http://localhost:3000/orders';

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
export const fetchOrders = async () => {
    const response = await fetch(ORDER_API_URL);
    return await response.json();
};

// ดึงข้อมูลคำสั่งซื้อตาม ID
export const fetchOrderById = async (id) => {
    const response = await fetch(`${ORDER_API_URL}/${id}`);
    return await response.json();
};

// สร้างคำสั่งซื้อใหม่
export const createOrder = async (data) => {
    const response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await response.json();
};

// ลบคำสั่งซื้อ
export const deleteOrder = async (id) => {
    await fetch(`${ORDER_API_URL}/${id}`, { method: 'DELETE' });
};
