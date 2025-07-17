```
# 📘 GraphQL Backend with Subscriptions (Apollo Server + Express + WebSockets)

This project is a GraphQL backend setup using:
- Apollo Server (with Express)
- GraphQL Subscriptions via WebSockets
- `graphql-ws` for real-time updates
- TypeScript for type safety and clarity

---

## 🚀 Features

- ✅ Fully functional GraphQL API with Query, Mutation, and Subscription support
- ✅ WebSocket support using `graphql-ws` and `ws`
- ✅ Live subscription updates via `PubSub`
- ✅ Modular schema and resolver structure
- ✅ CORS + JSON middleware for frontend integration

---

## 🏗️ Project Structure

```

.
├── src/
│   ├── index.ts          # Server entry point (Express + HTTP + WS)
│   └── schema.ts         # TypeDefs, Resolvers, and PubSub logic
├── package.json
├── tsconfig.json
└── README.md

````

---

## 🧠 Key Concepts

### 1. **PubSub**
Used to publish and subscribe to in-memory events (like `bookAdded`).

```ts
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
````

### 2. **Subscriptions**

Real-time updates using `graphql-ws` + WebSocket server.

```ts
Subscription: {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
  }
}
```

### 3. **makeExecutableSchema**

Combines type definitions and resolvers into a schema object.

```ts
const schema = makeExecutableSchema({ typeDefs, resolvers });
```

---

## ⚙️ How to Run

### 🔧 Install Dependencies

```bash
npm install
```

### 🏁 Start the Server

```bash
npm run dev
```

### 💻 Access GraphQL Playground (Apollo Sandbox)

Visit:

```
http://localhost:4000/graphql
```

You can:

* Run Queries & Mutations
* Open the **"Subscriptions" tab** to test real-time updates

---

## 🔗 Example Subscription Usage

### Add Book Mutation

```graphql
mutation {
  addBook(title: "Clean Code", author: "Robert C. Martin") {
    id
    title
    author
  }
}
```

### Book Subscription

```graphql
subscription {
  bookAdded {
    id
    title
    author
  }
}
```

---

## 📡 Subscriptions Server

* WebSocket endpoint runs at:
  `ws://localhost:4000/graphql`

Handled via:

```ts
useServer({ schema }, wsServer);
```

---

## 💻 Scripts (in `package.json`)

```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "start": "tsc && node dist/index.js"
}
```

---

## ✅ Tech Stack

* TypeScript
* Express
* Apollo Server
* graphql-ws
* ws
* graphql-subscriptions

---
🚀 Learning GraphQL, one resolver at a time!

