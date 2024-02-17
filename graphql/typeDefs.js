console.log('typeDefs file is run')
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
  }

  type Query {
    login(username: String!, password: String!): AuthData
    getAllEmployees: [Employee!]!
    getEmployeeById(id: ID!): Employee
  }

  type Mutation {
    signup(userInput: UserInput): User
    addNewEmployee(employeeInput: EmployeeInput): Employee
    updateEmployeeById(id: ID!, employeeUpdateInput: EmployeeUpdateInput): Employee
    deleteEmployeeById(id: ID!): Employee
  }
`;

console.log('typeDefs is loaded:', typeDefs);

module.exports = typeDefs;
