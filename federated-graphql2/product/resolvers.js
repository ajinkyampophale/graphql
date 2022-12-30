const {Client} = require('@elastic/elasticsearch');

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "EL2_6pkVUPtqvGfnlURS"
  }
});

// const getCategoryById = (categoryId) => {
//   return {__typename: "Category", id: categoryId};
// }

const resolvers = {
  Query: {
    product: async (_, {id}) => {
      const elasticRes = await client.search({
        index: "products",
        query: {
          match: {
            _id: id
          }
        }
      });
    
      let result = {};
      if(elasticRes?.hits?.hits?.length > 0){
        const resArr = elasticRes.hits.hits;
        result = {
          id: resArr[0]._id,
          name: resArr[0]._source.name,
          categoryId: resArr[0]._source.categoryId
        }
      }
    
      return result;
    },

    products: async () => {
      const elasticRes = await client.search({
        index: "products",
        query: {
          match_all: {}
        }
      });

      return loopProducts(elasticRes);
    }
  },

  Product: {
    category: (parent) => {
      return {__typename: "Category", id: parent.categoryId};
    }
  },

  // Product: {
  //   categories: (parent) => {
  //     const arrOfCategories = parent.categoryIds.map(ele => getCategoryById(ele));
  //     return arrOfCategories;
  //   }
  // },

  Category: {
    products: async (parent) => {
      const categoryId = parent.id;

      const elasticRes = await client.search({
        index: "products",
        query: {
          match: {
            categoryId
          }
        }
      });

      const result = loopProducts(elasticRes);
      return result;
    }
  }
}

const loopProducts = (elasticRes) => {
  let result = [];
  if(elasticRes?.hits?.hits?.length > 0){
    result = elasticRes.hits.hits.map(ele => {
      const obj = {
        id: ele._id,
        name: ele._source.name,
        categoryId: ele._source.categoryId
      };

      return obj;
    })
  }

  return result;
}

module.exports = {
  resolvers
}