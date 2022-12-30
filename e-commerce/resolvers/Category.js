const Category = {
  products: (parent, args, {db}) => {
    const {id: categoryId} = parent;
    const onSale = args?.filter?.onSale;
    
    db.products = db.products.filter(product => product.categoryId === categoryId);
    if(onSale) db.products = db.products.filter(({onSale}) => onSale);

    return db.products;
  }
};

module.exports = Category;