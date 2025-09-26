
import { rawProductsData } from './products.js';
import { Product, ProductManager } from "./product.js";

export const productInstances = rawProductsData.map(data => new Product(data));

const appManager = new ProductManager(productInstances);

appManager.init();


