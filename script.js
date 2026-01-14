async function checkout() {
    if (cart.length === 0) {
        showNotification('Добавьте товары в корзину!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderItems = cart.map(item => 
        `${item.name} (${item.quantity} шт.) - ${item.price * item.quantity} руб.`
    ).join('\n');
    
    // Получаем данные пользователя
    const user = Telegram.WebApp.initDataUnsafe?.user;
    const userId = user?.id || 'неизвестно';
    const username = user?.username || 'неизвестно';
    const firstName = user?.first_name || 'неизвестно';
    
    // Формируем сообщение
    const orderMessage = `
🛒 **НОВЫЙ ЗАКАЗ** 🛒

👤 **Покупатель:**
ID: ${userId}
Имя: ${firstName}
Username: @${username}

📦 **Состав заказа:**
${orderItems}

💰 **Итого к оплате:** ${total} руб.

⏰ **Время:** ${new Date().toLocaleString()}
🆔 **Номер заказа:** #${Date.now()}
    `;
    
    // 1. Отправляем себе в Telegram (вам как администратору)
    sendOrderToTelegram(orderMessage);
    
    // 2. Показываем подтверждение пользователю
    Telegram.WebApp.showAlert('✅ Заказ оформлен!\n\nМы свяжемся с вами в ближайшее время.', () => {
        cart = [];
        updateCart();
        Telegram.WebApp.close();
    });
}

// Функция отправки заказа в Telegram
async function sendOrderToTelegram(message) {
    const BOT_TOKEN = '8410253535:AAFB-vJJab3RPsL6IiFRYGDwOs3qFJORH24';
    const CHAT_ID = '1065686624'; // Ваш ID или ID группы
    
    try {
        // Отправка через Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            console.error('Ошибка отправки заказа');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
