# 🛍️ Shop-AI Assist

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-111827?style=for-the-badge&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Google Gemini" src="https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white">
  <img alt="Astra DB" src="https://img.shields.io/badge/DataStax-Astra_DB-00A986?style=for-the-badge">
</p>

<p align="center"><em>Store support for products, delivery, returns, payments, and policies.</em></p>

---

Shop-AI Assist is a customer-support chat app for an online store. Customers
can ask about products, delivery, returns, payments, and store policies. The
app retrieves relevant entries from an Astra DB knowledge base and uses
Google Gemini to draft a reply.

> **Current scope-** The app uses a prepared product and policy dataset. It is not
connected to live orders, customer accounts, or current inventory, so it
cannot verify an order status or stock level.

## --// What it does //--

- 💬 Answers customer questions using retrieved store information
- 🧠 Uses Google Gemini for embeddings and response generation
- 🔎 Searches product and policy content stored in Astra DB
- 🛡️ Validates chat messages and limits request size and history

## 🧰 Requirements

- 🟢 Node.js 20.9 or later
- 🗄️ An Astra DB database and application token
- 🔑 A Google Gemini API key

## 🚀 Set up

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with your credentials:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_TOKEN=your_astra_db_token
ASTRA_DB_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_NAMESPACE=your_astra_db_namespace
ASTRA_DB_COLLECTION=ecommerce_chatbot_vectors
```

🔒 Keep `.env` out of version control. Do not put API keys in client-side code.

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## 📚 Load the knowledge base

With the environment variables set, run:

```bash
npm run seed
```

The script splits the entries in `dataset.ts` into chunks and stores them as
768-dimensional vectors in the configured Astra DB collection. Embeddings are
created with Google's `gemini-embedding-001` model.

The seed script adds records; it does not clear the collection first. Running
it again can insert duplicate chunks. If the collection contains vectors made
with another embedding model or dimension, replace those records before
seeding so searches use a consistent vector space.

## 🧪 Available commands

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Serve the production build
npm run lint   # Run ESLint
npm run seed   # Add the knowledge-base entries to Astra DB
```

## 🗂️ Project structure

- `app/` — Next.js pages, chat interface, and API route
- `app/api/chat/route.ts` — validates chat requests, retrieves context, and
  generates replies
- `dataset.ts` — product and store-policy entries for the knowledge base
- `lib/embeddings.ts` — shared Gemini embedding configuration
- `scripts/loadDB.ts` — creates the Astra DB collection and loads the dataset
