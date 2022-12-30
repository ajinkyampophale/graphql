const {ApolloServer} = require('apollo-server');
const {ApolloGateway} = require('@apollo/gateway');

const port = 4000;

const gateway = new ApolloGateway({
  serviceList: [
    {name: "product", url: "http://localhost:4001"}
  ]
});

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false
});

apolloServer.listen({port}).then(({url}) => console.log(`Listening on ${url}`));