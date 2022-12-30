const Product = {
  category: (parent, args, {db}) => {
    const {categoryId} = parent;
    const category = db.categories.find(({id}) => id === categoryId);
    return category || null;
  },

  reviews: (parent, args, {db}) => {
    const {id: productId} = parent;
    return db.reviews.filter(review => review.productId === productId);
  } 
};

module.exports = Product;