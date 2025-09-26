


export class Product{
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.category = data.category;
        this.description = data.description;
        this.price = data.price;
        this.imageSrc = data.imageSrc;
        this.imageAlt = data.imageAlt;
        this.tags = data.tags;
    };

    //Gerador de HTML para o produto
    toHTML() {
        return `
            <div class="product-card">
                <a href="#" class="open-product-page">
                    <img src="${this.imageSrc}" alt="${this.imageAlt}" class="product-image">
                </a>
                <div class="product-info">
                    <a href="#" class="open-product-page">
                        <h3 class="product-title">${this.name}</h3>
                        <p class="product-category">${this.category}</p>
                        <span class="product-price">R$ ${this.price.toFixed(2).replace('.', ',')}</span>
                    </a>
                    <button class="btn-add-cart" data-id="${this.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    }


}

// Gerenciador de instanciação que também renderiza o grid de produtos
export class ProductManager {

    //Recebe a lista de produtos
    constructor(products) {
        this.products = products || [];
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProducts();
            this.setupAddToCartButtons();
        });
    }

    renderProducts(productsToRender = this.products, searchTerm = null) {
        try {
            const premiumGrid = document.getElementById('premium-grid');
            const bestsellersGrid = document.getElementById('bestsellers-grid');
            const mainProductSection = document.getElementById('main-product');
            const mainProductGrid = document.getElementById('main-product-grid');

            const premiumTitle = document.getElementById('premium-title');
            const bestsellersTitle = document.getElementById('bestsellers-title');
            const searchTitle = document.getElementById('search-title');

            const isSearchMode = searchTerm !== null;

            premiumGrid.innerHTML = '';
            bestsellersGrid.innerHTML = '';
            mainProductGrid.innerHTML = '';

            // Visibilidade dos grid's
            const visibility = isSearchMode ? 'none' : 'grid'; // Controla grids
            const titleVisibility = isSearchMode ? 'none' : 'block'; // Controla títulos

            premiumGrid.style.display = visibility;
            bestsellersGrid.style.display = visibility;
            premiumTitle.style.display = titleVisibility;
            bestsellersTitle.style.display = titleVisibility;

            mainProductSection.style.display = isSearchMode ? 'block' : 'none';

            // Renderização dos grid's
            if (isSearchMode) {
                // Modo de busca
                const resultsCount = productsToRender.length;

                searchTitle.textContent = resultsCount > 0
                    ? `Resultados da busca por "${searchTerm}" (${resultsCount})`
                    : `Nenhum resultado encontrado para "${searchTerm}"`;

                productsToRender.forEach(product => {
                    mainProductGrid.innerHTML += product.toHTML();
                });

            } else {
                // Modo de exibição dos grid's premium e best seller
                productsToRender.forEach(product => {
                    const productCardHTML = product.toHTML();

                    if (product.tags.includes('premium')) {
                        premiumGrid.innerHTML += productCardHTML;
                    }
                    if (product.tags.includes('bestseller')) {
                        bestsellersGrid.innerHTML += productCardHTML;
                    }
                });
            }

        } catch (error) {
            console.error("Erro durante a renderização:", error);
        }
    }

    addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

        const existingProductIndex = cart.findIndex(item => item.id == productId);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert('Produto adicionado ao carrinho!');
    }

    setupAddToCartButtons() {

        console.log("Configurando listeners de 'Adicionar ao Carrinho'...");

        try {
            document.body.addEventListener('click', (event) => {
                if (event.target && event.target.matches('.btn-add-cart')) {
                    const productId = event.target.dataset.id;

                    this.addToCart(productId);
                }
            });
            console.log("Listeners de 'Adicionar ao Carrinho' configurados via delegação.");

        } catch (error) {
            console.warn("Aviso: Falha ao configurar listeners de eventos.", error.message);
        }
    }

    //Lógica de busca de produtos
    setupSearch() {
        const searchInput = document.getElementById('search');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch(searchInput.value));

            console.log("Listener de busca em tempo real configurado.");
        }
    }

    handleSearch(query){
        const searchTerm = query.toLowerCase().trim();
        if (searchTerm === "") {
            this.renderProducts(this.products);
            return;
        }

        const filteredProducts = this.products.filter(product => {
            const productName = product?.name ?? "";
            return productName.toLowerCase().includes(searchTerm);
        });

        this.renderProducts(filteredProducts, searchTerm);
    }
    }


