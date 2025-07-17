import express from 'express';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { typeDefs, resolvers } from "./schema.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
// import { pubsub } from './schema.js';
// console.log("FROM INDEX → PubSub Type:", typeof pubsub);
// console.log("FROM INDEX → Has asyncIterator?", typeof pubsub.asyncIterator);


const startServer = async()=> {

  const app = express();
    const PORT = 4000;
    const httpServer = createServer(app);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer =  new WebSocketServer({
        server:httpServer,path:'/graphql' })

        useServer({ schema }, wsServer);

        const server =  new ApolloServer({schema});
        await server.start();

        app.use('/graphql',cors(),express.json(),expressMiddleware(server));

        httpServer.listen(PORT,()=> {
            console.log(`🚀Server is running on port ${PORT}`);
             console.log(`📡 Subscriptions ready at ws://localhost:${PORT}/graphql`);
        })
        }
  startServer();