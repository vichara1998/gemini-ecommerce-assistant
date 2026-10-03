# Gemini-Powered E-Commerce Assistant

An e-commerce customer support chatbot built with Next.js, Google Gemini, and
Astra DB. It uses vector search to answer questions about products, orders,
shipping, returns, and store policies.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env` file in the project root:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_TOKEN=your_astra_db_token
ASTRA_DB_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_NAMESPACE=your_astra_db_namespace
ASTRA_DB_COLLECTION=ecommerce_chatbot_vectors
```

Keep this file private; do not commit API keys or database credentials.

## Seed the product knowledge base

With the environment variables set, run:

```bash
npm run seed
```

The seed script writes product and policy content to the
`ecommerce_chatbot_vectors` collection. It uses `gemini-embedding-001` with
768-dimensional vectors. If the collection contains vectors from a different
embedding model, clear those vectors before reseeding so searches do not mix
incompatible embedding spaces.
