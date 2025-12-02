export class CartDTO {
  constructor(cart) {
    this.id = cart._id?.toString() || cart.id;
    this.user = cart.user?.toString() || cart.user;
    this.products = (cart.products || []).map((item) => ({
      product: item.product?._id?.toString() || item.product?.toString() || item.product,
      quantity: item.quantity,
      ...(item.product?.title && {
        productInfo: {
          title: item.product.title,
          price: item.product.price,
        },
      }),
    }));
  }

  static fromCart(cart) {
    if (!cart) return null;
    return new CartDTO(cart);
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user,
      products: this.products,
    };
  }
}

