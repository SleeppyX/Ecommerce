const API_URL = 'http://localhost:3000/products'; // เปลี่ยน URL ตาม Backend ของคุณ

let cart = []; // เก็บข้อมูลสินค้าในตะกร้า

// ดึงข้อมูลสินค้า
const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
    }
};

window.viewProductDetail = (productID) => {
    // เปลี่ยนไปยังหน้า product-detail.html พร้อมพารามิเตอร์ ID
    window.location.href = `product-detail.html?id=${productID}`;
};

const renderProducts = (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // ล้างรายการเก่า

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.dataset.id = product._id;
        productDiv.dataset.category = product.category;
        productDiv.dataset.price = product.price;

        // สร้าง HTML สำหรับสินค้าแต่ละรายการ
        productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>฿${product.price.toLocaleString()}</p>
        <button onclick="viewProductDetail('${product._id}')">ดูรายละเอียด</button>
        `;

        productList.appendChild(productDiv);
    });
};

// ฟังก์ชันเพิ่มสินค้าในตะกร้า
window.addToCart = (id, name, price) => {
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // เก็บข้อมูลใน localStorage
    updateCart(); // อัปเดต UI
};


// อัปเดตตะกร้าใน HTML
const updateCart = () => {
    const cartList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');

    cartList.innerHTML = ''; // ล้างรายการเก่า
    let totalPrice = 0;

    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;

        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} x ${item.quantity} - ฿${(item.price * item.quantity).toLocaleString()}`;
        cartList.appendChild(listItem);
    });

    totalPriceElement.textContent = totalPrice.toLocaleString(); // อัปเดตราคาสินค้ารวม
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0); // อัปเดตจำนวนสินค้าในไอคอนตะกร้า
};


// ฟังก์ชันกรองสินค้า
const applyFilters = () => {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;


    const categoryMap = {
        "แอร์": "AirConditioner",
        "พัดลม": "Fan",
        "เครื่องฟอกอากาศ": "AirPurifier",
        "AirConditioner": "แอร์",
        "Fan": "พัดลม",
        "AirPurifier": "เครื่องฟอกอากาศ"
    };

    // แปลงค่าหมวดหมู่จากภาษาไทยเป็นภาษาอังกฤษ
    const mappedCategory = categoryMap[selectedCategory] || selectedCategory;

    const products = document.querySelectorAll('.product');
    products.forEach((product) => {
        const name = product.querySelector('h2').textContent.toLowerCase();
        const category = product.dataset.category; // ค่าใน data-category
        const price = parseFloat(product.dataset.price);

        // ตรวจสอบการจับคู่
        const matchesSearch = name.includes(searchQuery);
        const matchesCategory = !mappedCategory || category === mappedCategory;
        const matchesPrice = price >= minPrice && price <= maxPrice;

        // แสดงหรือซ่อนสินค้า
        if (matchesSearch && matchesCategory && matchesPrice) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
};
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCart();
};
document.addEventListener('DOMContentLoaded', loadCartFromStorage);


// Event Listeners สำหรับตัวกรอง
document.getElementById('search-bar').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);
document.getElementById('min-price').addEventListener('input', applyFilters);
document.getElementById('max-price').addEventListener('input', applyFilters);


fetchProducts();
