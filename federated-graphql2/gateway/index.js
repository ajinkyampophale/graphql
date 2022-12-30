const {ApolloServer} = require('apollo-server');
const {ApolloGateway, IntrospectAndCompose} = require('@apollo/gateway');

const port = 4000;

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {name: "product", url: "http://localhost:4001"},
      {name: "category", url: "http://localhost:4002"}
    ]
  }),
});

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false
});

apolloServer.listen({port}).then(({url}) => console.log(`Listening on ${url}`));