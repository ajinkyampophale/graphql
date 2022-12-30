const {gql} = require('apollo-server');

const typeDefs = gql`
  type Category @key(fields: "id") {
    id: ID
    name: String
  }

  extend type Product @key(fields: "id"){
    id: ID! @external
  }

  extend type Query{
    category(id: ID!): Category
    categories: [Category]
  }
`;

module.exports = {
  typeDefs
}