const { ApolloServer } = require("apollo-server");
const {typeDefs} = require('./schema');
const {Query, Product, Category, Mutation} = require('./resolvers');
const {db} = require('./db');

const apolloServer = new ApolloServer({
  typeDefs, 
  resolvers: {
    Query,
    Mutation,
    Product,
    Category
  },
  context: {
    db
  }
});


apolloServer.listen({port: 7000}).then(({url}) => {
  console.log(`Server is ready at `, url);
});