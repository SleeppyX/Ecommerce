const API_URL = 'http://localhost:3000/users/login'; // URL สำหรับ API Login

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // ส่งคำขอ POST ไปยัง Backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your email and password.');
        }

        const data = await response.json();

        // ดูข้อมูลที่ได้รับจาก API
        console.log(data);  // ตรวจสอบข้อมูลที่ตอบกลับจาก API

        // เก็บ Token หรือข้อมูลลง LocalStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userEmail', data.email);

        // ตรวจสอบว่า API ส่งข้อมูลชื่อผู้ใช้ (username, name, หรืออีเมล์) หรือไม่
        const username = data.username || data.name || data.email || 'Guest'; // หากไม่พบ, ใช้ 'Guest'

        alert(`Welcome back, ${username}`);
        window.location.href = 'index.html'; // เปลี่ยนเส้นทางไปยังหน้า Home
    } catch (error) {
        alert(error.message);
    }
});
