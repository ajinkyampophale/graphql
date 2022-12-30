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

const port = 4001;

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID
    name: String
  }

  extend type Query{
    product(id: ID!): Product
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    product: async (_, {id}) => {
      const elasticRes = await client.search({
        index: "new_products",
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

    products: async () => {
      const elasticRes = await client.search({
        index: "new_products",
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

apolloServer.listen({port}).then(({url}) => console.log(`Product server ready on ${url}`));