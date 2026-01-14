/**
 * МАГАЗИН ЗДОРОВЬЯ - полная версия
 * Включает товары, корзину и уведомления о заказах
 */

// ==================== КОНФИГУРАЦИЯ ====================
const CONFIG = {
    BOT_TOKEN: '8410253535:AAFB-vJJab3RPsL6IiFRYGDwOs3qFJORH24', // Замените на свой
    ADMIN_CHAT_ID: '1065686624', // Замените на свой
    SHOP_NAME: 'Магазин Здоровья',
    SUPPORT_CONTACT: '@HealthShopSupport',
    CURRENCY: '₽'
};

// ==================== ДАННЫЕ ТОВАРОВ ====================
const PRODUCTS = [
    {
        id: 1,
        name: "Витаминный комплекс Премиум",
        description: "Полный набор витаминов и минералов для укрепления иммунитета и повышения энергии",
        price: 2490,
        image: "https://images.unsplash.com/photo-1532968961967-ee3a49086b71?w=400&h=300&fit=crop",
        category: "витамины",
        stock: 15
    },
    {
        id: 2,
        name: "Омега-3 Ультра",
        description: "Концентрированный рыбий жир высшего качества из диких рыб",
        price: 1890,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        category: "БАДы",
        stock: 22
    },
    {
        id: 3,
        name: "Травяной чай 'Релакс'",
        description: "Успокаивающий сбор из экологически чистых трав: ромашка, мята, мелисса",
        price: 890,
        image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop",
        category: "чаи",
        stock: 30
    },
    {
        id: 4,
        name: "Аромадиффузер с LED",
        description: "Умный диффузер для ароматерапии с 7 цветами подсветки и таймером",
        price: 3590,
        image: "https://images.unsplash.com/photo-1547760847-f8f6d6c5f0d9?w=400&h=300&fit=crop",
        category: "ароматерапия",
        stock: 8
    },
    {
        id: 5,
        name: "Органическая Спирулина",
        description: "Порошок спирулины высшего качества для детоксикации и укрепления организма",
        price: 1290,
        image: "https://images.unsplash.com/photo-1570586437263-ab629fccc6c1?w=400&h=300&fit=crop",
        category: "суперфуды",
        stock: 18
    },
    {
        id: 6,
        name: "Мед с прополисом и маточным молочком",
        description: "Натуральный горный мед с добавлением прополиса и маточного молочка",
        price: 1690,
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=300&fit=crop",
        category: "продукты пчеловодства",
        stock: 12
    },
    {
        id: 7,
        name: "Эфирные масла '5 элементов'",
        description: "Набор из 5 эфирных масел: лаванда, эвкалипт, чайное дерево, апельсин, мята",
        price: 2190,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
        category: "ароматерапия",
        stock: 25
    },
    {
        id: 8,
        name: "Детокс-программа 'Очищение'",
        description: "14-дневная программа очищения организма с инструкцией и поддержкой",
        price: 4590,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        category: "программы",
        stock: 6
    }
];

// ==================== ПЕРЕМЕННЫЕ ====================
let cart = JSON.parse(localStorage.getItem('healthShopCart')) || [];
let orders = JSON.parse(localStorage.getItem('customerOrders')) || [];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadProducts();
    initCategories();
    updateCart();
    loadOrders();
    initTelegram();
}

// ==================== ТОВАРЫ ====================
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    if (PRODUCTS.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Товары временно отсутствуют</h3>
                <p>Попробуйте зайти позже</p>
            </div>
        `;
        return;
    }
    
    displayProducts(PRODUCTS);
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        const isInStock = product.stock > 0;
        const stockText = isInStock ? 
            `<span class="stock in-stock">В наличии (${product.stock} шт.)</span>` : 
            `<span class="stock out-of-stock">Нет в наличии</span>`;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">${product.category}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Товар'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${stockText}
                <div class="product-footer">
                    <div class="product-price">${product.price} ${CONFIG.CURRENCY}</div>
                    <button class="add-to-cart ${!isInStock ? 'disabled' : ''}" 
                            onclick="addToCart(${product.id})"
                            ${!isInStock ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${isInStock ? 'В корзину' : 'Нет в наличии'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function initCategories() {
    const categories = ['все', ...new Set(PRODUCTS.map(p => p.category))];
    const container = document.querySelector('.categories');
    
    if (!container) return;
    
    container.innerHTML = categories.map((cat, index) => `
        <button class="category-btn ${index === 0 ? 'active' : ''}" 
                data-category="${cat}">
            ${cat === 'все' ? 'Все товары' : cat}
        </button>
    `).join('');
    
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    if (category === 'все') {
        displayProducts(PRODUCTS);
    } else {
        const filtered = PRODUCTS.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// ==================== КОРЗИНА ====================
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification(`Достигнут лимит товара на складе!`);
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`"${product.name}" добавлен в корзину!`);
}

function updateCart() {
    localStorage.setItem('healthShopCart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.textContent = totalItems;
    
    if (document.getElementById('cart-overlay')?.style.display === 'flex') {
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!container || !totalElement) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
            </div>
        `;
        totalElement.textContent = `0 ${CONFIG.CURRENCY}`;
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/60/4CAF50/FFFFFF?text=Товар'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ${CONFIG.CURRENCY} × ${item.quantity}</div>
                <div class="cart-item-total">${itemTotal} ${CONFIG.CURRENCY}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    totalElement.textContent = `${total} ${CONFIG.CURRENCY}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = PRODUCTS.find(p => p.id === productId);
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (product && newQuantity > product.stock) {
        showNotification(`Максимальное количество: ${product.stock} шт.`);
        return;
    }
    
    item.quantity = newQuantity;
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Товар удален из корзины');
}

function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    if (!overlay) return;
    
    if (overlay.style.display === 'flex') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
        renderCartItems();
    }
}

// ==================== ОФОРМЛЕНИЕ ЗАКАЗА ====================
async function checkout() {
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину!');
        return;
    }
    
    // Запрашиваем контактные данные
    const contactInfo = await getContactInfo();
    if (!contactInfo) return;
    
    // Создаем заказ
    const order = createOrder(contactInfo);
    
    try {
        // Сохраняем заказ для покупателя
        saveCustomerOrder(order);
        
        // Отправляем уведомление администратору
        await sendOrderNotification(order);
        
        // Показываем подтверждение
        showOrderConfirmation(order);
        
        // Очищаем корзину
        cart = [];
        updateCart();
        
        // Сохраняем заказ в историю
        orders.push(order);
        localStorage.setItem('customerOrders', JSON.stringify(orders));
        
    } catch (error) {
        console.error('Ошибка оформления:', error);
        showNotification('Ошибка при оформлении заказа. Попробуйте еще раз.');
    }
}

function createOrder(contactInfo) {
    const orderId = 'ORD-' + Date.now().toString().slice(-8);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
    }));
    
    return {
        id: orderId,
        date: new Date().toISOString(),
        status: 'new',
        customer: contactInfo,
        items: items,
        total: total,
        comment: document.getElementById('order-comment')?.value || ''
    };
}

async function getContactInfo() {
    return new Promise((resolve) => {
        // Если в Telegram, используем данные пользователя
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        
        if (user) {
            const contactInfo = {
                name: user.first_name || '',
                username: user.username ? '@' + user.username : '',
                userId: user.id.toString()
            };
            
            // Запрашиваем телефон через попап
            Telegram.WebApp.showPopup({
                title: '📞 Контактный телефон',
                message: 'Укажите номер телефона для связи по заказу:',
                buttons: [
                    {id: 'cancel', type: 'cancel', text: 'Отмена'},
                    {id: 'ok', type: 'default', text: 'Продолжить'}
                ]
            }, (buttonId) => {
                if (buttonId === 'ok') {
                    Telegram.WebApp.showPopup({
                        title: '📞 Введите телефон',
                        message: 'Например: +7 999 123-45-67',
                        buttons: [
                            {id: 'submit', type: 'default', text: 'Готово'}
                        ]
                    }, () => {
                        const phone = prompt('Введите номер телефона:');
                        if (phone && phone.length >= 10) {
                            contactInfo.phone = phone;
                            resolve(contactInfo);
                        } else {
                            showNotification('Пожалуйста, укажите корректный номер телефона');
                            resolve(null);
                        }
                    });
                } else {
                    resolve(null);
                }
            });
        } else {
            // В браузере запрашиваем все данные
            const name = prompt('Введите ваше имя:', '');
            const phone = prompt('Введите ваш телефон:', '+7');
            
            if (!name || !phone || phone.length < 10) {
                showNotification('Пожалуйста, заполните все поля корректно');
                resolve(null);
                return;
            }
            
            resolve({
                name: name,
                phone: phone,
                username: '',
                userId: 'browser_' + Date.now()
            });
        }
    });
}

async function sendOrderNotification(order) {
    // Формируем сообщение для администратора
    const message = createOrderMessage(order);
    
    // Если указаны токены, отправляем в Telegram
    if (CONFIG.BOT_TOKEN && CONFIG.BOT_TOKEN !== 'ВАШ_BOT_TOKEN' &&
        CONFIG.ADMIN_CHAT_ID && CONFIG.ADMIN_CHAT_ID !== 'ВАШ_CHAT_ID') {
        
        await sendToTelegram(message);
        
    } else {
        // В тестовом режиме сохраняем в localStorage
        console.log('Тестовый режим. Сообщение администратору:', message);
        saveTestOrder(message);
    }
}

function createOrderMessage(order) {
    const itemsText = order.items.map(item => 
        `├ ${item.name}\n├ Количество: ${item.quantity} шт.\n├ Цена: ${item.price} ₽\n└ Сумма: ${item.total} ₽`
    ).join('\n\n');
    
    return `
🛒 *НОВЫЙ ЗАКАЗ #${order.id}*

👤 *Клиент:* ${order.customer.name}
📱 *Телефон:* ${order.customer.phone || 'не указан'}
${order.customer.username ? `📞 *Username:* ${order.customer.username}` : ''}
🆔 *ID:* ${order.customer.userId}

📋 *Состав заказа:*
${itemsText}

💰 *Итого:* ${order.total} ${CONFIG.CURRENCY}

💬 *Комментарий:* ${order.comment || 'нет'}

📅 *Дата:* ${new Date(order.date).toLocaleString('ru-RU')}
🔄 *Статус:* ${getStatusText(order.status)}

#заказ #${order.id}
    `.trim();
}

async function sendToTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: CONFIG.ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '✅ Принят',
                            callback_data: `accept_${orderId}`
                        },
                        {
                            text: '📞 Позвонить',
                            url: `tel:${order.customer.phone}`
                        }
                    ]]
                }
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        throw error;
    }
}

function showOrderConfirmation(order) {
    const confirmation = `
✅ *Заказ #${order.id} принят!*

Спасибо за покупку в ${CONFIG.SHOP_NAME}!

📋 *Детали заказа:*
${order.items.map(item => `• ${item.name} × ${item.quantity} = ${item.total} ₽`).join('\n')}

💰 *Итого к оплате:* ${order.total} ₽

📞 *Для связи:* ${CONFIG.SUPPORT_CONTACT}
📅 *Дата заказа:* ${new Date(order.date).toLocaleString('ru-RU')}

💡 *Вы можете отслеживать статус заказа в разделе "Мои заказы"*
    `;
    
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.showAlert(confirmation, () => {
            window.location.href = 'orders.html';
        });
    } else {
        alert(confirmation);
        window.location.href = 'orders.html';
    }
}

function saveCustomerOrder(order) {
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    orders.push(order);
    localStorage.setItem('customerOrders', JSON.stringify(orders));
}

function saveTestOrder(message) {
    const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
    testOrders.push({
        message: message,
        time: new Date().toISOString()
    });
    localStorage.setItem('testOrders', JSON.stringify(testOrders));
}

// ==================== МОИ ЗАКАЗЫ ====================
function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;
    
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>У вас пока нет заказов</h3>
                <p>Совершите первую покупку в нашем магазине</p>
                <a href="index.html" class="btn-primary">Вернуться в магазин</a>
            </div>
        `;
        return;
    }
    
    // Сортируем по дате (новые сверху)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = orders.map(order => `
        <div class="order-card status-${order.status}">
            <div class="order-header">
                <div class="order-id">Заказ #${order.id}</div>
                <div class="order-status">${getStatusText(order.status)}</div>
            </div>
            
            <div class="order-date">
                ${new Date(order.date).toLocaleString('ru-RU')}
            </div>
            
            <div class="order-items">
                <h4>Состав заказа:</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">×${item.quantity}</span>
                        <span class="item-price">${item.total} ₽</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                <span>Итого:</span>
                <span class="total-amount">${order.total} ₽</span>
            </div>
            
            <div class="order-actions">
                <button class="btn-secondary" onclick="repeatOrder('${order.id}')">
                    <i class="fas fa-redo"></i> Повторить заказ
                </button>
                ${order.status === 'new' ? `
                    <button class="btn-cancel" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i> Отменить
                    </button>
                ` : ''}
            </div>
            
            ${order.comment ? `
                <div class="order-comment-display">
                    <strong>Ваш комментарий:</strong> ${order.comment}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function getStatusText(status) {
    const statuses = {
        'new': '🆕 Новый',
        'processing': '🔄 В обработке',
        'shipped': '🚚 Отправлен',
        'delivered': '✅ Доставлен',
        'cancelled': '❌ Отменен'
    };
    return statuses[status] || status;
}

function repeatOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Заказ не найден');
        return;
    }
    
    // Добавляем товары из заказа в корзину
    order.items.forEach(item => {
        const product = PRODUCTS.find(p => p.name === item.name);
        if (product) {
            const existingItem = cart.find(cartItem => cartItem.id === product.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: item.quantity
                });
            }
        }
    });
    
    updateCart();
    showNotification('Товары из заказа добавлены в корзину!');
    window.location.href = 'index.html';
}

function cancelOrder(orderId) {
    if (!confirm('Вы уверены, что хотите отменить этот заказ?')) return;
    
    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'cancelled';
        localStorage.setItem('customerOrders', JSON.stringify(orders));
        loadOrders();
        showNotification('Заказ отменен');
    }
}

// ==================== TELEGRAM ИНТЕГРАЦИЯ ====================
function initTelegram() {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Устанавливаем тему
        Telegram.WebApp.setHeaderColor('#4CAF50');
        Telegram.WebApp.setBackgroundColor('#f5f7fa');
        
        // Добавляем кнопку "Назад" в мини-приложении
        if (Telegram.WebApp.BackButton) {
            Telegram.WebApp.BackButton.show();
            Telegram.WebApp.BackButton.onClick(() => {
                if (window.location.pathname.includes('orders.html')) {
                    window.location.href = 'index.html';
                } else {
                    Telegram.WebApp.close();
                }
            });
        }
    }
}

// ==================== УТИЛИТЫ ====================
function showNotification(text, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.log('Уведомление:', text);
        return;
    }
    
    notification.textContent = text;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Открыть страницу заказов
function openOrdersPage() {
    window.location.href = 'orders.html';
}

// Экспортируем функции для использования в HTML
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.openOrdersPage = openOrdersPage;
window.repeatOrder = repeatOrder;
window.cancelOrder = cancelOrder;
window.filterProducts = filterProducts;
