const {Client} = require('@elastic/elasticsearch');

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "EL2_6pkVUPtqvGfnlURS"
  }
});

const resolvers = {
  Category: {
    __resolveReference: async (ref) => {
      return await getCategory(ref.id);
    }
  },

  Query: {
    category: async (_, {id}) => {
      return await getCategory(id);
    },

    categories: async () => {
      const elasticRes = await client.search({
        index: "categories",
        query: {
          match_all: {}
        }
      });

      let result = [];
      if(elasticRes?.hits?.hits?.length > 0){
        result = elasticRes.hits.hits.map(ele => {
          return {
            id: ele._id,
            name: ele._source.name
          };
        })
      }

      return result;
    }
  }
}

const getCategory = async (id) => {
  const elasticRes = await client.search({
    index: "categories",
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
      name: resArr[0]._source.name
    }
  }

  return result;
}

module.exports = {
  resolvers
}