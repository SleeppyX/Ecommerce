const loadCart = () => {
  const cartData = localStorage.getItem('cart');
  const cart = cartData ? JSON.parse(cartData) : []; // กำหนดค่าเริ่มต้น
  console.log('Cart data loaded:', cart); // ตรวจสอบข้อมูลที่โหลด
  updateCart(cart);
};

const updateCart = (cart) => {
    const cartList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');

    cartList.innerHTML = ''; // ล้างรายการเก่า
    let totalPrice = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>ไม่มีสินค้าในตะกร้า</li>';
    } else {
        cart.forEach((item, index) => {
            // คำนวณยอดรวมเฉพาะสินค้าที่จำนวนมากกว่า 0
            if (item.quantity > 0) {
                totalPrice += item.price * item.quantity;
                totalItems += item.quantity;
            }

            // สร้างแถวสินค้า
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} - $${item.price.toLocaleString()}</span>
                <span>จำนวน: ${item.quantity}</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                    <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                </div>
                <span>รวม: $${(item.price * item.quantity).toLocaleString()}</span>
                <button class="remove-btn" onclick="removeItem(${index})">ลบ</button>
            `;
            cartList.appendChild(listItem);
        });
    }

    totalPriceElement.textContent = totalPrice.toLocaleString(); // อัปเดตราคา
    cartCountElement.textContent = totalItems; // อัปเดตจำนวนสินค้า
};


// ฟังก์ชันเพิ่มจำนวนสินค้า
const increaseQuantity = (index) => {
  const cartData = localStorage.getItem('cart');
  if (cartData) {
      const cart = JSON.parse(cartData);
      cart[index].quantity += 1; // เพิ่มจำนวนสินค้า
      localStorage.setItem('cart', JSON.stringify(cart)); // อัปเดตข้อมูลใน LocalStorage
      updateCart(cart); // อัปเดต UI
  }
};

// ฟังก์ชันลดจำนวนสินค้า
const decreaseQuantity = (index) => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        const cart = JSON.parse(cartData);

        // ลดจำนวนสินค้า และอนุญาตให้เหลือ 0
        if (cart[index].quantity > 0) {
            cart[index].quantity -= 1; // ลดจำนวนสินค้า
        }

        // บันทึกกลับไปยัง LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // อัปเดต UI
        updateCart(cart);
    }
};
const removeItem = (index) => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        const cart = JSON.parse(cartData);

        // ลบสินค้าตามตำแหน่งที่เลือก
        cart.splice(index, 1);

        // อัปเดตข้อมูลใน LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // อัปเดต UI
        updateCart(cart);
    }
};



document.addEventListener('DOMContentLoaded', loadCart);
