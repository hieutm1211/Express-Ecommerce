const {
  BadRequestError
} = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishesForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} = require("../models/repositories/product.repo");
const {
  removeUndefinedObject,
  updateNestedObjectParser
} = require("../utils");

// Factory class to create product
class ProductFactoryV2 {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactoryV2.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactoryV2.productRegistry[type];

    if (!productClass) throw new BadRequestError(`Invalid Product Type: ${type}`)

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactoryV2.productRegistry[type];

    if (!productClass) throw new BadRequestError(`Invalid Product Type: ${type}`)

    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({
    product_shop,
    product_id
  }) {
    return await publishProductByShop({
      product_shop,
      product_id
    });
  }

  static async unPublishProductByShop({
    product_shop,
    product_id
  }) {
    return await unPublishProductByShop({
      product_shop,
      product_id
    });
  }

  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = {
      product_shop,
      isDraft: true
    };

    return await findAllDraftsForShop({
      query,
      limit,
      skip
    });
  }

  static async findAllPublishesForShop({
    product_shop,
    limit = 50,
    skip = 0
  }) {
    const query = {
      product_shop,
      isPublished: true
    };

    return await findAllPublishesForShop({
      query,
      limit,
      skip
    });
  }

  static async searchProducts({
    keySearch
  }) {
    return await searchProductByUser({
      keySearch
    });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = {
      isPublished: true
    }
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
    });
  }

  static async findProduct({
    product_id
  }) {
    return await findProduct({
      product_id,
      unSelect: ['__v']
    })
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_thumb = product_thumb,
      this.product_name = product_name,
      this.product_description = product_description,
      this.product_price = product_price,
      this.product_quantity = product_quantity,
      this.product_type = product_type,
      this.product_shop = product_shop,
      this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    const newProduct =  await product.create({
      ...this,
      _id: product_id
    });

    if(newProduct){
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product
    })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });

    if (!newClothing) throw new BadRequestError('create new clothing error');

    const newProduct = await super.createProduct();

    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    console.log('objectParams', objectParams);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing
      })
    }

    return await super.updateProduct(productId, updateNestedObjectParser(objectParams));
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });

    if (!newElectronic) throw new BadRequestError('create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });

    if (!newFurniture) throw new BadRequestError('create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id);

    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

ProductFactoryV2.registerProductType('Electronics', Electronics);
ProductFactoryV2.registerProductType('Clothing', Clothing);
ProductFactoryV2.registerProductType('Furniture', Furniture);

module.exports = ProductFactoryV2;