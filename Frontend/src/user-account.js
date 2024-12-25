document.addEventListener('DOMContentLoaded', function() {
  // แสดงข้อมูลผู้ใช้
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (userProfile) {
    document.getElementById('username-display').textContent = userProfile.username;
    document.getElementById('username').value = userProfile.username;
    document.getElementById('email').value = userProfile.email;
    document.getElementById('phone').value = userProfile.phone;
    document.getElementById('profile-address').value = userProfile.address;
  } else {
    document.getElementById('username-display').textContent = 'แขก';
  }

  // แสดงข้อมูลประวัติการสั่งซื้อ
  displayOrderHistory();
});

// ฟังก์ชันบันทึกข้อมูลบัญชีผู้ใช้
document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('profile-address').value;

  // บันทึกข้อมูลผู้ใช้ลงใน LocalStorage
  const userProfile = { username, email, phone, address };
  localStorage.setItem('userProfile', JSON.stringify(userProfile));

  alert('บัญชีของคุณอัพเดทแล้ว!');
});

// ฟังก์ชันแสดงประวัติการสั่งซื้อ
function displayOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderHistoryList = document.getElementById('order-history-list');
  orderHistoryList.innerHTML = ''; // ล้างรายการเก่า

  // แสดงประวัติการสั่งซื้อ
  orders.forEach(order => {
    const listItem = document.createElement('li');
    listItem.textContent = `Order #${order.orderNumber} - ${order.date} - Total: ${order.total}`;
    orderHistoryList.appendChild(listItem);
  });
}

// ฟังก์ชันลบประวัติการสั่งซื้อทั้งหมด
function clearOrderHistory() {
  if (confirm('คุณแน่ใจที่จะลบประวัติการสั่งซื้อหรือไม่?')) {
    localStorage.removeItem('orders'); // ลบประวัติการสั่งซื้อจาก localStorage
    displayOrderHistory(); // อัปเดตหน้าจอ
  }
}
