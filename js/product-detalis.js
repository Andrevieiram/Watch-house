import { productInstances } from './main.js';
import { ProductManager } from './product.js'; // Para usar o addToCart

// Gerador do HTML
function createDetailsHTML(product) {
    return `
        <div class="product-details-container container">
            <div class="product-details-image">
                <img src="${product.imageSrc}" alt="${product.imageAlt}">
            </div>
            <div class="product-details-info">
                <h1 class="details-title">${product.name}</h1>
                <p class="details-category">Categoria: ${product.category}</p>
                <p class="details-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p class="details-description">${product.description}</p>
               
                
                <button class="btn-primary" id="add-to-cart-details-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

// Renderização
function renderProductDetails(product) {
    document.title = product.name + " - Watch House";

    const detailsHTML = createDetailsHTML(product);

    document.querySelector('main.product-card').innerHTML = detailsHTML;
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.querySelector('main.product-card').innerHTML = '<h1>Erro: ID do produto não encontrado na URL.</h1>';
        return;
    }

    const productData = productInstances.find(p => p.id == productId);

    if (!productData) {
        document.querySelector('main.product-card').innerHTML = '<h1>Produto não encontrado no catálogo.</h1>';
        return;
    }

    renderProductDetails(productData);

    const cartHandler = new ProductManager(productInstances);

    document.getElementById('add-to-cart-details-btn').addEventListener('click', () => {
        cartHandler.addToCart(productId);
    });
});