const { BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids = []}){
    const foundCart = await findCartById(cartId);

    if(!foundCart) throw new BadRequestError('Cart not found');

    const checkout_order = {
      totalPrice: 0,
      shippingFee: 0,
      totalDiscount: 0,
      totalCheckout: 0, 
    }, shop_order_ids_new = [];

    //calculate total bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
      
      //check product available 
      const checkProductServer = await checkProductByServer(item_products);
      console.log('checkProductServer::', checkProductServer);
      
      if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!');

      //calculate total order
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0);
      console.log('checkout price', checkoutPrice);
      //total amount before processing
      checkout_order.totalPrice += checkoutPrice;
      console.log('checkout.totalPrice', checkout_order.totalPrice);
      console.log('item_products', item_products);

      const itemCheckout = {
        shopId,
        shop_discounts,
        price: checkoutPrice,
        discountPrice: checkoutPrice,
        item_products: checkProductServer
      }

      console.log('item_checkout', itemCheckout);

      if(shop_discounts.length > 0){
        //assume we only have one discount
        const {totalPrice = 0, discount = 0}  = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        });

        checkout_order.totalDiscount += discount;

        if(discount > 0) {
          itemCheckout.discountPrice = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.discountPrice;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartIds,
    userId,
    userAddress,
    userPayment
  }) {
    const { shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    });

    //check inventory 
    const products = shop_order_ids_new.flatMap(order => order.item_products);
    console.log('products', products);
    const acquireProduct = [];

    for (let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      
      acquireProduct.push( keyLock ? true : false );
      
      if(keyLock){
        await releaseLock(keyLock);
      }
    }

    //create new order
    const newOrder = order.create({});

    //insert successfully, remove products from cart
    if(newOrder){

    }
    
  }

  static async getOrdersByUser() {

  }

  static async getOneOrderByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByShop() {
    
  }
}

module.exports = CheckoutService;