const apiUrl = 'http://localhost:3000/products'; // URL ของ API

// ฟังก์ชันดึงข้อมูลสินค้า
async function fetchProducts() {
    const tableBody = document.getElementById('product-table');
    tableBody.innerHTML = ''; // ล้างข้อมูลเดิม

    try {
        const response = await fetch(apiUrl); // ส่ง GET request ไปยัง API
        const products = await response.json();

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>
                    <button class="editBtn" onclick="editProduct('${product._id}', '${product.name}', '${product.price}', '${product.category}')">Edit</button>
                    <button class="delBtn" onclick="deleteProduct('${product._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// ฟังก์ชันเพิ่มสินค้า
async function addProduct(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;  // รับค่า id
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;
    const specialFeatures = document.getElementById('specialFeatures').value;
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;
    const description = document.getElementById('description').value;
    const stock = parseInt(document.getElementById('stock').value, 10);

    // ตรวจสอบว่า id, name, price, category, description, และ stock ถูกกรอกครบถ้วน
    if (!id || !name || !price || !category || !description || !stock) {
        alert('Please fill in all required fields!');
        return;
    }

    const newProduct = {
        id,  // ส่ง id ด้วย
        name,
        price,
        category,
        image,
        specialFeatures,
        size,
        color,
        description,
        stock
    };

    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.errors.map(e => e.msg).join(', ')}`);
            return;
        }

        alert('Product added successfully');
        fetchProducts(); // รีเฟรชข้อมูลสินค้า
    } catch (error) {
        console.error('Error adding product:', error);
    }
}



// ฟังก์ชันลบสินค้า
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Product deleted successfully');
            fetchProducts(); // รีเฟรชข้อมูล
        } else {
            const result = await response.json();
            alert('Error deleting product: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// ฟังก์ชันแก้ไขสินค้า
function editProduct(id, name, price, category) {
    document.getElementById('name').value = name;
    document.getElementById('price').value = price;
    document.getElementById('category').value = category;

    // เปลี่ยนฟังก์ชันของปุ่มเป็นการอัปเดต
    const form = document.getElementById('product-form');
    form.onsubmit = async function(event) {
        event.preventDefault();

        const updatedProduct = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Product updated successfully');
                fetchProducts(); // รีเฟรชข้อมูล
                form.onsubmit = addProduct; // รีเซ็ตฟังก์ชันให้กลับไปเป็นการเพิ่มสินค้า
            } else {
                alert('Error updating product: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
}

// เรียกข้อมูลสินค้าทันทีเมื่อโหลดหน้า
document.getElementById('product-form').addEventListener('submit', addProduct);
fetchProducts();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('product-form').addEventListener('submit', addProduct);
});
