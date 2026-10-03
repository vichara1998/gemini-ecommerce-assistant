# Shop-AI Assist

Shop-AI Assist is a customer support chat application for an online store. It
uses a prepared product and policy knowledge base to help answer questions
about products, payments, delivery, returns, and store policies.

The application uses Next.js and React for the web interface, Google Gemini
for embeddings and answer generation, and Astra DB for vector search.

## What the application does

- Provides a responsive customer support chat interface
- Offers common question prompts for orders, returns, delivery, products, and payments
- Lets customers type messages and send with Enter, or use Shift and Enter for a new line
- Shows message times and an assistant typing indicator
- Lets customers copy assistant replies or start a new conversation
- Follows pointer movement with a background glow and slowly moving lines
- Uses direct pointer positioning when reduced motion is enabled and shortens other interface transitions. The ambient line drift continues.
- Retrieves up to five relevant entries from the Astra DB knowledge base for each question
- Uses Gemini to write a concise answer grounded in the retrieved store information

## Current limitations

The application uses the static product and policy entries in `dataset.ts`. It
does not connect to a commerce platform, order system, customer account, or
live inventory service. It cannot look up an individual order or confirm
current stock, prices, or account details. The assistant is instructed to say
when the supplied store information does not answer a question.

Conversation messages are held in browser memory. They are not saved between
page visits, and there is no sign-in or customer profile.

## How a chat request works

1. The browser sends the latest conversation messages to the chat API.
2. The API checks that the request contains between one and twenty valid
   messages. Each message must contain non-empty text of no more than 2,000
   characters.
3. The latest customer message is converted to a 768-dimensional query
   embedding with Google's `gemini-embedding-001` model.
4. Astra DB returns up to five matching knowledge base entries.
5. The chat API sends those entries and the recent conversation to
   `gemini-2.5-flash` to draft a response.
6. The browser displays the reply in the conversation.

Invalid chat requests receive an HTTP 400 response. If embedding, database, or
answer generation fails, the API logs the error on the server and returns an
HTTP 503 response.

## Requirements

- Node.js 20.9 or newer
- An Astra DB database with a database token
- A Google Gemini API key

## Local setup

Install the project dependencies.

```bash
npm install
```

Create a `.env` file in the project root.

```dotenv
GEMINI_API_KEY=your_gemini_api_key
ASTRA_DB_TOKEN=your_astra_db_token
ASTRA_DB_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_NAMESPACE=your_astra_db_namespace
ASTRA_DB_COLLECTION=ecommerce_chatbot_vectors
```

Keep this file out of version control. Never put private API keys or database
credentials in browser code.

Start the development server.

```bash
npm run dev
```

Open a browser and visit localhost on port 3000.

## Load the store information

The source entries for products and store policies are in `dataset.ts`. To
split them into searchable chunks and add them to Astra DB, run the seed
command.

```bash
npm run seed
```

The seeder uses chunks of up to 300 characters with 50 characters of overlap.
It creates 768-dimensional document embeddings with
`gemini-embedding-001` and stores each chunk in the configured Astra DB
collection.

The seed command adds records and does not clear the collection first. Running
it again can create duplicate records. Before reseeding, remove old entries if
you have changed the dataset or embedding model. All vectors in a collection
used for search must have the same dimension and come from a compatible
embedding model.

## Project commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run seed
```

Use the development command while working on the application. Build creates a
production version, and start serves that build. Lint runs ESLint. Seed loads
the knowledge base into Astra DB.

## Main files

- `app/page.tsx` contains the chat interface and browser-side conversation state
- `app/globle.css` contains the interface styles, responsive layout, and background motion
- `app/components/Bubble.tsx` renders user and assistant messages
- `app/components/LoadingBubble.tsx` renders the typing indicator
- `app/api/chat/route.ts` validates requests, retrieves context, and generates replies
- `dataset.ts` contains the product and policy reference entries
- `lib/embeddings.ts` configures Gemini embeddings and checks their dimensions
- `scripts/loadDB.ts` creates or opens the Astra DB collection and loads the dataset

## Technology

- Next.js 16 and React 19
- TypeScript
- Google Gemini for text embeddings and response generation
- DataStax Astra DB for vector storage and retrieval
- LangChain text splitting for preparing knowledge base entries
- React Markdown for rendering formatted assistant replies
