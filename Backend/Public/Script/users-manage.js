const apiUrl = 'http://localhost:3000/users';

// ดึงข้อมูลผู้ใช้จาก API
async function fetchUsers() {
    const tableBody = document.getElementById('user-table');
    tableBody.innerHTML = ''; // ล้างข้อมูลเดิม

    try {
        const response = await fetch(apiUrl);
        const users = await response.json();

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>
          <select id="role-${user._id}" onchange="updateUserRole('${user._id}')">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
          <td>
          <button class="editBtn" onclick="editUser('${user._id}', '${user.username}', '${user.email}', '${user.role}')">Edit</button>
          <button class="delBtn" onclick="deleteUser('${user._id}')">Delete</button>
          </td>
      `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// เพิ่มผู้ใช้ใหม่
async function addUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value; // รับค่าบทบาท

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role }), // ส่งข้อมูล role ด้วย
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.errors.map(e => e.msg).join(', ')}`);
            return;
        }

        alert('User added successfully');
        fetchUsers();
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

// ลบผู้ใช้
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            return;
        }

        alert('User deleted successfully');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// แก้ไขผู้ใช้
function editUser(id, username, email, role) {
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const roleField = document.getElementById('role');

    usernameField.value = username;
    emailField.value = email;
    roleField.value = role; // กำหนด role ในฟอร์ม

    const form = document.getElementById('user-form');
    form.onsubmit = async function (event) {
        event.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: usernameField.value,
                    email: emailField.value,
                    role: roleField.value, // ส่ง role ไปด้วย
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            alert('User updated successfully');
            fetchUsers();
            form.onsubmit = addUser; // รีเซ็ตฟอร์มกลับเป็นการเพิ่มผู้ใช้
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
}

// อัพเดตบทบาทผู้ใช้
async function updateUserRole(id) {
    const role = document.getElementById(`role-${id}`).value;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }), // ส่ง role ที่เลือก
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
            return;
        }

        alert('User role updated successfully');
        fetchUsers(); // รีเฟรชข้อมูลผู้ใช้
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

// เริ่มต้นโหลดข้อมูลผู้ใช้
document.getElementById('user-form').addEventListener('submit', addUser);
fetchUsers();
