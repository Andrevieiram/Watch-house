import { rawProductsData } from './products.js';
import { Product } from './product.js';

const products = rawProductsData.map(data => new Product(data));

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.cart-items-list')) {
        renderCart();
        setupCartInteractions();
    }
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
        orderSummaryContainer.style.display = 'none';
        return;
    }

    orderSummaryContainer.style.display = 'block';
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id == item.id);
        if (product) {
            const itemTotalPrice = product.price * item.quantity;
            subtotal += itemTotalPrice;
            totalItems += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-product-id="${product.id}">
                    <img src="${product.imageSrc}" alt="${product.imageAlt}" class="item-image">
                    <div class="item-details">
                        <h3 class="item-name">${product.name}</h3>
                        <p class="item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-quantity-controls">
                        <button class="quantity-btn decrease-qty">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase-qty">+</button>
                    </div>
                    <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }
    });
    
    cartItemsContainer.innerHTML += `
        <div class="continue-shopping-container">
            <a href="index.html" class="btn-secondary">Continuar Comprando</a>
        </div>
    `;

    orderSummaryContainer.innerHTML = `
        <h2>Resumo do Pedido</h2>
        <div class="summary-row">
            <span>Subtotal (${totalItems} ${totalItems > 1 ? 'itens' : 'item'})</span>
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
        <a href="checkout.html" class="btn-checkout">Finalizar Compra</a>
    `;
}



function setupCartInteractions() {
    const cartItemsContainer = document.querySelector('.cart-items-list');
    
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const cartItemElement = target.closest('.cart-item');
        if (!cartItemElement) return;

        const productId = cartItemElement.dataset.productId;

       
        if (target.matches('.increase-qty')) {
            updateQuantity(productId, 1); 
        } 
        
        else if (target.matches('.decrease-qty')) {
            updateQuantity(productId, -1); 
        } 
        
        else if (target.closest('.remove-item-btn')) {
            removeFromCart(productId);
        }
    });
}


function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity += change;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCart(); 
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const updatedCart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    renderCart(); 
}

