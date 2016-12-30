const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');

// Data
const losties = {
  1: {
    character: "Jack Shepard",
    actor: "Matthew Fox",
    role: "Oceanic Survivor",
    traits: "doctor, leader",
    id: 1
  },
  2: {
    character: "John Locke",
    actor: "Terry O'Quinn",
    role: "Oceanic Survivor",
    traits: "paranoic, explorer",
    id: 2
  },
  3: {
    character: "Benjamin Linus",
    actor: "Michael Emerson",
    role: "Others",
    traits: "villain",
    id: 3
  },
  4: {
    character: "Desmond Hume",
    actor: "Henry Ian Cusick",
    role: "Hatch guest",
    traits: "medium, leader",
    id: 4
  }
};

// Model Type
const lostieType = new GraphQLObjectType({
  name: 'Lostie',
  description: 'A Lostie character',
  fields: {
    character: { type: GraphQLString, description: 'Name of the character' },
    actor: { type: GraphQLString, description: 'Actor playing the character' },
    role: { type: GraphQLString, description: 'Character role' },
    traits: { type: GraphQLString, description: 'Traits this Lostie is know for' },
    id: { type: GraphQLInt, description: 'ID of this Lostie' }
  }
});

// Query type
const queryType = new GraphQLObjectType({
  name: 'query',
  description: 'Lostie query',
  fields: {
    lostie: {
      type: lostieType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: function (_, args) {
        return getLostie(args.id);
      }
    }
  }
});

// Resolver function
function getLostie (id) {
  return losties[id];
}

// Schema Type
const schema = new GraphQLSchema({
  query: queryType
});

// Serving the Schema
const graphQLServer = express();

graphQLServer.use('/', graphqlHTTP({
  schema,
  graphiql: true
}));

graphQLServer.listen(8080, () => console.log('GraphQL Server running.'));

const compiler = webpack({
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
});

const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: { '/graphql': `http://localhost:${8080}`},
  publicPath: '/static/',
  stats: { colors: true }
});

app.use('/', express.static('static'));
app.listen(3000, () => console.log('The App server is running'));
