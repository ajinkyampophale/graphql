const {gql} = require('apollo-server');

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String
    categoryId: String
    category: Category
  }

  extend type Category @key(fields: "id") {
    id: ID @external
    products: [Product]
  }

  extend type Query{
    product(id: ID!): Product
    products: [Product]
  }
`;

module.exports = {
  typeDefs
}