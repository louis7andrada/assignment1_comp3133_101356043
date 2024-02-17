require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs } = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const { isAuthenticated } = require('./utils/auth');

console.log('typeDefs:', JSON.stringify(typeDefs, null, 2));
console.log('resolvers:', resolvers);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err.message));

const app = express();

app.use(express.json());

app.use(isAuthenticated);

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ isAuth: req.isAuth, userId: req.userId }),
    });

    await server.start();

    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startApolloServer();
