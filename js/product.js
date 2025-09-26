


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

    renderProducts() {
        try {
            const premiumGrid = document.getElementById('premium-grid');
            const bestsellersGrid = document.getElementById('bestsellers-grid');

            // Verifica se as grids existem. Se não existirem, lança um erro para o bloco catch.
            if (!premiumGrid || !bestsellersGrid) {
                throw new Error("Elementos de grid ('premium-grid' ou 'bestsellers-grid') não foram encontrados no DOM.");
            }

            premiumGrid.innerHTML = '';
            bestsellersGrid.innerHTML = '';

            // A iteração (forEach) também pode falhar se this.products não for um array válido
            this.products.forEach(product => {
                const productCardHTML = product.toHTML();

                if (product.tags.includes('premium')) {
                    premiumGrid.innerHTML += productCardHTML;
                }
                if (product.tags.includes('bestseller')) {
                    bestsellersGrid.innerHTML += productCardHTML;
                }
            });

        } catch (error) {

            document.body.innerHTML = '<h1>Houve um erro ao carregar o catálogo.</h1>';
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
    }

