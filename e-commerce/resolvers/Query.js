const Query = {
  products: (parent, args, {db}) => {

    if(args?.filter){
      const {onSale, avgRating} = args.filter;

      if(onSale) db.products = db.products.filter(({onSale}) => onSale);

      if(avgRating) {
        db.products = db.products.filter(({id: productId}) => {
          let productSum = 0, productLength = 0;
  
          db.reviews.forEach(review => {
            if(review.productId === productId){
              productSum += review.rating;
              productLength++;
            }
          });
  
          const productAvg = productSum / productLength;
          return productAvg >= avgRating;
        });
      }
    }

    return db.products;
  },

  product: (parent, args, {db}) => {
    const {id: productId} = args;
    const product = db.products.find(({id}) => id === productId);
    return product || null;
  },

  categories: (parent, args, {db}) => db.categories,

  category: (parent, args, {db}) => {
    const {id: categoryId} = args;
    const category = db.categories.find(({id}) => id === categoryId);
    return category || null;
  }
};

module.exports = Query;