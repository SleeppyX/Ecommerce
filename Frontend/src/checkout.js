let cart = [];

// ฟังก์ชันโหลดข้อมูลจาก localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    displayCartItems(); // แสดงสินค้าเมื่อโหลดข้อมูลจาก localStorage
  }
}

// ฟังก์ชันแสดงสินค้าในรถเข็น
function displayCartItems() {
  const orderItemsContainer = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

  orderItemsContainer.innerHTML = ""; // ล้างรายการเก่า
  let total = 0;

  const filteredCart = cart.filter(item => item.quantity > 0); // กรองเฉพาะสินค้าที่มีจำนวนมากกว่า 0

  if (filteredCart.length === 0) {
    orderItemsContainer.innerHTML = "<li>ไม่มีสินค้าในรถเข็น</li>"; // ถ้าไม่มีสินค้า
  } else {
    filteredCart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
      orderItemsContainer.appendChild(li);
      total += item.price * item.quantity; // คำนวณยอดรวม
    });
  }

  orderTotal.textContent = total.toFixed(2); // อัปเดตยอดรวม
}

// ฟังก์ชันตรวจสอบและยืนยันการสั่งซื้อ
function submitCheckout() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const postalCode = document.getElementById('postal-code').value;
  const country = document.getElementById('country').value;

  const paymentMethod = document.querySelector('input[name="payment-method"]:checked');

  if (!name || !address || !city || !postalCode || !country || !paymentMethod) {
    alert("โปรดกรอกข้อมูลให้ครบถ้วนและเลือกวิธีการชำระเงิน");
    return;
  }

  alert("ขอบคุณสำหรับการสั่งซื้อ! คุณชำระเงินผ่านทาง " + paymentMethod.value);

  // บันทึกประวัติการสั่งซื้อ
  const order = {
    orderNumber: Date.now().toString(), // ใช้ timestamp เพื่อสร้างหมายเลขคำสั่งซื้อ
    date: new Date().toLocaleDateString(),
    total: document.getElementById("order-total").textContent,
  };

  saveOrderHistory(order); // บันทึกประวัติการสั่งซื้อ

  // ลบข้อมูลจาก localStorage หลังการชำระเงิน
  localStorage.removeItem('cart');
  cart = []; // ล้างข้อมูลใน cart
  displayCartItems(); // อัปเดตหน้าจอหลังการซื้อ
}

// ฟังก์ชันบันทึกประวัติการสั่งซื้อ
function saveOrderHistory(order) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

// ฟังก์ชันโหลดข้อมูลจาก localStorage เมื่อโหลดหน้า Checkout
window.onload = function () {
  loadCartFromLocalStorage();
};
