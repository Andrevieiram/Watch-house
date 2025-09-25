document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items-list');
    const orderSummaryContainer = document.querySelector('.order-summary-box');

    cartItemsContainer.innerHTML = ''; 
    orderSummaryContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <h2>Seu carrinho está vazio.</h2>
                <p>Adicione produtos da loja para vê-los aqui.</p>
                <a href="index.html" class="btn-primary">Voltar à Loja</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id == item.id);
        if (product) {
            const itemTotalPrice = product.price * item.quantity;
            subtotal += itemTotalPrice;
            totalItems += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${product.imageSrc}" alt="${product.imageAlt}" class="item-image">
                    <div class="item-details">
                        <h3 class="item-name">${product.name}</h3>
                        <p class="item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-quantity-controls">
                        <button class="quantity-btn" data-id="${product.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" data-id="${product.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }
    });

    orderSummaryContainer.innerHTML = `
        <h2>Resumo do Pedido</h2>
        <div class="summary-row">
            <span>Subtotal (${totalItems} itens)</span>
            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="summary-row">
            <span>Frete</span>
            <span>Grátis</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <button class="btn-checkout">Finalizar Compra</button>
    `;
}