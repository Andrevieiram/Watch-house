document.addEventListener('DOMContentLoaded', () => {

    const premiumGrid = document.getElementById('premium-grid');
    const bestsellersGrid = document.getElementById('bestsellers-grid');

    
    products.forEach(product => {
        // Criando o HTML do card do produto
        const productCardHTML = `
            <div class="product-card">
                <a href="#" class="open-product-page">
                    <img src="${product.imageSrc}" alt="${product.imageAlt}" class="product-image">
                </a>
                <div class="product-info">
                    <a href="#" class="open-product-page">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-description">${product.description}</p>
                        <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        ${product.soldInfo ? `<span class="quantity">${product.soldInfo}</span>` : ''}
                    </a>
                    <button class="btn-add-cart">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;

        // Verificando as tags do produto e inserindo o card na seção correta
        if (product.tags.includes('premium')) {
            premiumGrid.innerHTML += productCardHTML;
        }
        if (product.tags.includes('bestseller')) {
            bestsellersGrid.innerHTML += productCardHTML;
        }
    });
});