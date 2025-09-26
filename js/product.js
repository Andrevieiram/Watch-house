


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
                <a href="#" class="open-product-page" data-product-id="${this.id}">
                        <img src="${this.imageSrc}" alt="${this.imageAlt}" class="product-image">
                    
                    <div class="product-info" >
                     
                            <h3 class="product-title">${this.name}</h3>
                            <p class="product-category">${this.category}</p>
                            <span class="product-price">R$ ${this.price.toFixed(2).replace('.', ',')}</span>
                    </div>        
                </a>
                    <button class="btn-add-cart" data-id="${this.id}">Adicionar ao Carrinho</button>
                
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
            this.setupSearch();
            this.setupProductPageListeners();
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

            // Visibilidade dos grid's
            const visibility = isSearchMode ? 'none' : 'grid'; // Controla grids
            const titleVisibility = isSearchMode ? 'none' : 'block'; // Controla títulos

            if (premiumGrid) {
                premiumGrid.style.display = visibility;
                premiumGrid.innerHTML = '';
            }
            if (bestsellersGrid) {
                bestsellersGrid.style.display = visibility;
                bestsellersGrid.innerHTML = '';
            }
            if (premiumTitle) {
                premiumTitle.style.display = titleVisibility;
            }
            if (bestsellersTitle) {
                bestsellersTitle.style.display = titleVisibility;
            }

            if (mainProductSection) {
                mainProductSection.style.display = isSearchMode ? 'block' : 'none';
            }
            if (mainProductGrid) {
                mainProductGrid.innerHTML = '';
            }

            if (mainProductSection) {
                mainProductSection.style.display = isSearchMode ? 'block' : 'none';
            }

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

                    if (product.tags.includes('premium') && premiumGrid) {
                        premiumGrid.innerHTML += productCardHTML;
                    }
                    if (product.tags.includes('bestseller') && bestsellersGrid) {
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
            console.log("Listeners de 'Adicionar ao Carrinho' configurados com sucesso.");

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

    setupProductPageListeners() {
        document.body.addEventListener('click', (event) => {
            const target = event.target.closest('.open-product-page');

            if (target) {
                event.preventDefault();

                const productId = target.dataset.productId;

                if (productId) {
                    console.log(`Abrindo detalhes para o produto ID: ${productId}`);

                    window.location.href = `product-details.html?id=${productId}`;
                }
            }
        });
        console.log("Listener para abrir detalhes configurado com sucesso.");
    }
    }


