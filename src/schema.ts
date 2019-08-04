const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project]
    project(id:ID!): Project

    pages(projectId: ID!): [Page],

    elements(projectID: ID!, type: String!, name: String!): [Element]

    symbolLibs: [SymbolLib]
    symbolLib(id: ID!): SymbolLib
    symbolLibByName(name: String!): SymbolLib
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project
    deleteProject(input: DeleteProjectInput!): ID

    createPage(input: CreatePageInput!): Page
    deletePage(input: DeletePageInput!): ID
    updatePage(input: UpdatePageInput!): ID
    
    createPlacement(input: [CreatePlacementInput]!): [Placement]
    updatePlacements(input: [UpdatePlacementInput]!): [ID]
    deletePlacements(input: [DeletePlacementInput]!): [ID]

    createElement(input: CreateElementInput!): Element
    updateElement(input: UpdateElementInput!): ID
    deleteElement(input: DeleteElementInput!): ID

    createSymbolLib(input: CreateSymbolLibInput!): SymbolLib
    deleteSymbolLib(input: DeleteSymbolLibInput!): ID

    createSymbol(input: CreateSymbolInput!): Symbol
    updateSymbol(input: UpdateSymbolInput!): ID
    deleteSymbol(input: DeleteSymbolInput!): ID
  }

  type Symbol {
    id: ID
    name: String,
    content: String

    placements: [Placement]
  }

  input CreateSymbolInput {
    symbolLibId: ID!
    id: ID
    name: String!
    content: String!
  }
  input UpdateSymbolInput {
    symbolLibId: ID!
    id: ID!
    name: String!
    content: String!
  }
  input DeleteSymbolInput {
    symbolLibId: ID!
    id: ID!
  }

  type SymbolLib {
    id: ID
    name: String

    symbol(id: ID!): Symbol
    symbols: [Symbol]
  }

  input CreateSymbolLibInput {
    name: String!
    id: ID
  }
  input DeleteSymbolLibInput {
    id: ID!
  }

  input CreateProjectInput {
    name: String!
    id: ID
  }
  input DeleteProjectInput {
    id: ID!
  }

  type Project {
    id: ID,
    name: String,
    pages: [Page],
    page(id: ID!): Page,

    elements: [Element]
  }


  input CreatePageInput {
    projectId: ID!,
    name: String!
  }
  input DeletePageInput {
    projectId: ID!,
    id: ID!
  }
  input UpdatePageInput {
    projectId: ID!,
    id: ID!,
    name: String!,
  }

  type Page {
    id: ID,
    name: String
    placements: [Placement]
  }

  type Placement {
    id: ID,
    type: String,
    content: String
  }

  input CreatePlacementInput {
    id: ID,
    parentIds: [ID]!,
    parentType: String!,
    type: String!,
    content: String!
  }
  input UpdatePlacementInput {
    parentIds: [ID]!,
    parentType: String!,
    id: ID!,
    content: String!
  }
  input DeletePlacementInput {
    parentIds: [ID]!,
    parentType: String!,
    id: ID!
  }

  type Element {
    projectId: ID
    id: ID
    type: String,
    name: String,
    content: String,
  }

  input CreateElementInput {
    projectId: ID!,
    type: String!,
    name: String!,
    content: String!
  }

  input DeleteElementInput {
    projectId: ID!,
    id: ID!
  }

  input UpdateElementInput {
    projectId: ID!,
    id: ID!,
    type: String!,
    name: String!,
    content: String!
  }

`);

export default schema;
