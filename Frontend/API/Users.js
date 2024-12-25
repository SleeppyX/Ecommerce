const USER_API_URL = 'http://localhost:3000/users';

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const fetchUsers = async () => {
    const response = await fetch(USER_API_URL);
    return await response.json();
};

// ดึงข้อมูลผู้ใช้ตาม ID
export const fetchUserById = async (id) => {
    const response = await fetch(`${USER_API_URL}/${id}`);
    return await response.json();
};

// สมัครสมาชิก
export const registerUser = async (data) => {
    const response = await fetch(`${USER_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await response.json();
};

// ลบผู้ใช้
export const deleteUser = async (id) => {
    await fetch(`${USER_API_URL}/${id}`, { method: 'DELETE' });
};
