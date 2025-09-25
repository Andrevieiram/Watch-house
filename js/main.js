
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupAddToCartButtons();
});

function renderProducts() {
    const premiumGrid = document.getElementById('premium-grid');
    const bestsellersGrid = document.getElementById('bestsellers-grid');

    products.forEach(product => {
        const productCardHTML = `
            <div class="product-card">
                <a href="#" class="open-product-page">
                    <img src="${product.imageSrc}" alt="${product.imageAlt}" class="product-image">
                </a>
                <div class="product-info">
                    <a href="#" class="open-product-page">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    </a>
                    <button class="btn-add-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        // Adicionando os cards nas seções corretas
        if (product.tags?.includes('premium')) {
            premiumGrid.innerHTML += productCardHTML;
        }
        if (product.tags?.includes('bestseller')) {
            bestsellersGrid.innerHTML += productCardHTML;
        }
    });
}

// Configurando os botões "Adicionar ao Carrinho"
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.btn-add-cart');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            addToCart(productId);
        });
    });
}

// Adicionando um item ao carrinho
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    alert('Produto adicionado ao carrinho!');
}