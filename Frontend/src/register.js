const API_URL = 'http://localhost:3000/users/register'; // URL สำหรับ API Register

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อ submit

    // ดึงข้อมูลจากฟอร์ม
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // ตรวจสอบว่าอีเมลและรหัสผ่านตรงกันหรือไม่
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (!email || !password || !confirmPassword) {
        alert('Please check email or password.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // ตรวจสอบความยาวของรหัสผ่าน
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        // ส่งคำขอ POST ไปยัง Backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed. Please try again.');
        }

        const data = await response.json();

        // เก็บ Token หรือข้อมูลลง LocalStorage หรือจัดการข้อมูลที่ได้รับ
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userEmail', data.email);

        //const username = data.username || data.name || data.email;

        alert(`Welcome ${username}`);
        window.location.href = 'login.html'; // เปลี่ยนเส้นทางไปยังหน้า Login
    } catch (error) {
        alert(error.message);
    }
});
