// ฟังก์ชันสำหรับโหลดข้อมูลสินค้า
async function loadProductDetail(productId) {
    try {
        // ดึงข้อมูลจาก API หรือ Database โดยใช้ productId
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลสินค้าได้');
        const product = await response.json();

        // แสดงรายละเอียดสินค้าในหน้า
        document.getElementById('product-detail').innerHTML = `
            
            <div class="product-container">
            <div class="D1">
            <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="D2">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>ราคา: ฿${product.price.toLocaleString()}</p>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">เพิ่มในตระกร้า</button>
            </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-detail').innerHTML = '<p>ไม่พบข้อมูลสินค้า</p>';
    }
}

// ดึง ID จาก URL และโหลดข้อมูลสินค้า
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);  
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetail(productId);
    } else {
        document.getElementById('product-detail').innerHTML = '<p>ไม่พบข้อมูลสินค้า</p>';
    }
});
function addToCart(id, name, price) {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];

    // ตรวจสอบว่ามีสินค้าในตระกร้าหรือยัง
    const existingProduct = cart.find((item) => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1; // เพิ่มจำนวนสินค้า
    } else {
        // เพิ่มสินค้าใหม่
        cart.push({ id, name, price, quantity: 1 });
    }

    // บันทึกกลับไปยัง LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // อัปเดตจำนวนสินค้าในไอคอนตระกร้า
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    alert(`เพิ่ม "${name}" ลงในตระกร้าเรียบร้อยแล้ว!`);
}
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        loadProductDetail(productId);
    } else {
        document.getElementById('product-detail').innerHTML = '<p>ไม่พบข้อมูลสินค้า</p>';
    }

    // อัปเดตจำนวนสินค้าในไอคอนตระกร้า
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
});
