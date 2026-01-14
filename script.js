// Данные о товарах (в реальном приложении загружались бы с сервера)
let products = [];
let cart = JSON.parse(localStorage.getItem('healthShopCart')) || [];

// Загрузка товаров
async function loadProducts() {
    try {
        // В реальном приложении здесь был бы fetch запрос
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        // Запасные данные
        products = [
            {
                id: 1,
                name: "Витаминный комплекс",
                description: "Полный набор витаминов для укрепления иммунитета",
                price: 1200,
                image: "https://via.placeholder.com/150",
                category: "витамины"
            }
        ];
        displayProducts(products);
    }
}

// Отображение товаров
function displayProducts(productsToShow) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${product.price} руб.</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Фильтрация по категориям
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Убрать активный класс у всех кнопок
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Добавить активный класс текущей кнопке
        this.classList.add('active');
        
        const category = this.dataset.category;
        
        if (category === 'все') {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(
                product => product.category === category
            );
            displayProducts(filteredProducts);
        }
    });
});

// Функции корзины
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`"${product.name}" добавлен в корзину!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Сохраняем корзину в localStorage
    localStorage.setItem('healthShopCart', JSON.stringify(cart));
    
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    
    // Обновляем отображение корзины
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>Ваша корзина пуста</p>
            </div>
        `;
        cartTotalElement.textContent = '0 руб.';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity} = ${itemTotal} руб.</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `${total} руб.`;
}

function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину!');
        return;
    }
    
    // В реальном приложении здесь была бы отправка данных на сервер
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} (${item.quantity} шт.) - ${item.price * item.quantity} руб.`
    ).join('\n');
    
    const message = `Заказ оформлен!\n\n${orderDetails}\n\nИтого: ${total} руб.\n\nСпасибо за покупку!`;
    
    // В реальном Telegram Mini App здесь был бы вызов Telegram API
    alert(message);
    
    // Очищаем корзину
    cart = [];
    updateCart();
    toggleCart();
    
    showNotification('Заказ успешно оформлен!');
}

function showNotification(text) {
    const notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCart();
    
    // Закрытие корзины при клике вне ее
    document.getElementById('cart-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            toggleCart();
        }
    });
});