export class ProductDTO {
  constructor(product) {
    this.id = product._id?.toString() || product.id;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails || [];
  }

  static fromProduct(product) {
    if (!product) return null;
    return new ProductDTO(product);
  }

  static fromProducts(products) {
    return products.map((product) => ProductDTO.fromProduct(product));
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      code: this.code,
      price: this.price,
      status: this.status,
      stock: this.stock,
      category: this.category,
      thumbnails: this.thumbnails,
    };
  }
}

