const {ApolloServer} = require('apollo-server');
const {buildSubgraphSchema} = require("@apollo/federation");
const {typeDefs} = require('./typeDefs');
const {resolvers} = require('./resolvers');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const port = 4002;

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{typeDefs, resolvers}])
});

apolloServer.listen({port}).then(({url}) => console.log(`Category server ready on ${url}`));