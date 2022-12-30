const {ApolloServer, gql} = require('apollo-server');
const {Client} = require('@elastic/elasticsearch');
const {buildFederatedSchema} = require("@apollo/federation");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "EL2_6pkVUPtqvGfnlURS"
  }
});

const port = 4002;

const typeDefs = gql`
  type Category @key(fields: "id") {
    id: ID
    name: String,
    products: [Product]
  }

  extend type Product @key(fields: "id"){
    id: ID! @external
    name: String
  }

  extend type Query{
    category(id: ID!): Category
    categories: [Category]
  }
`;

const resolvers = {
  Category: {
    products: async (parent) => {
      const elasticRes = await client.search({
        index: "new_products",
        query: {
          match: {
            categoryId: parent.id
          }
        }
      });

      let result = [];
      if(elasticRes?.hits?.hits?.length > 0){
        result = elasticRes.hits.hits.map(ele => {
          return {
            __typename: "Product",
            id: ele._id
          };
        })
      }

      return result;
    } 
  },

  Query: {
    category: async (_, {id}) => {
      const elasticRes = await client.search({
        index: "new_categories",
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
    },

    categories: async () => {
      const elasticRes = await client.search({
        index: "new_categories",
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

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([{typeDefs, resolvers}])
});

apolloServer.listen({port}).then(({url}) => console.log(`Category server ready on ${url}`));