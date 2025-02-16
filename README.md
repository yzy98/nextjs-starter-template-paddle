# Next.js Starter Template Paddle

A modern full-stack starter template with authentication, database, payments, and UI components.

## Tech Stack

| Category       | Technology          |
| -------------- | ------------------- |
| Framework      | Next.js             |
| Styling        | Tailwind CSS        |
| Components     | Shadcn UI           |
| Authentication | Clerk               |
| Database       | Supabase PostgreSQL |
| ORM            | Prisma              |
| Payments       | Paddle              |
| Rate Limiting  | Upstash             |
| API Layer      | tRPC                |

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- pnpm (recommended) or npm
- Git

### Installation Steps

1. **Download the template**

```bash
git clone https://github.com/yzy98/nextjs-starter-template-paddle.git
cd nextjs-starter-template-paddle
pnpm install
```

2. **Set up .env**

copy `.env.example` to `.env`, and fill in the values according to the comments in the `.env.example` file.
You need to initialize Clerk, Supabase, Paddle and Upstash projects.

3. **Initialize Database**

```bash
pnpm db:push
```

You can go to your Supabase project dashboard to check if all User, Product, Price and Subscription tables have been created.

## Features

- 🎯 Styled with Tailwind CSS
- 🎨 Beautiful UI components with Shadcn
- 🔐 Authentication with Clerk
- 🗄️ PostgreSQL Database with Supabase
- 💳 Payment processing with Paddle
- 🔄 Real-time webhook handling
- 🚀 Type-safe ORM with Prisma
- ⚡️ TRPC for end-to-end type-safe API
- 🛡️ Upstash for rate limiting

## Architecture

![Architecture](./public/images/architecture.png)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── webhook/route.ts
│   │   └── billing/
│   │   |   └── webhook/route.ts
|   |   └── user/route.ts
│   ├── sign-in/
│   ├── sign-up/
│   ├── dashboard/
│   ├── pricing/
│   ├── checkout/
│   |   ├── [priceId]/
│   |   └── success/
│   ├── (mdx-page)/
│   |   └── layout.tsx
│   |   └── privacy/
│   |   └── terms-of-use/
├── components/
│   ├── ui/
│   └── checkout/
│   └── dashboard/
│   └── layout/
│   └── pricing/
│   └── providers/
├── markdowns/
├── lib/
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── trpc/
├── server/
│   └── db/
│   └── paddle/
│   └── redis/
├── middleware.ts
├── .env
└── .env.example
```

## Webhook Setup

1. Sign up / in **_[Ngrok](https://dashboard.ngrok.com/signup)_**
1. Install ngrok in your local machine

using `homebrew`

```bash
brew install ngrok
```

or `npm`

```bash
npm install -g ngrok
```

3. Authenticate your ngrok agent

```bash
ngrok config add-authtoken $YOUR_AUTHTOKEN
```

4. Get a static domain in **_[Ngrok Dashboard](https://dashboard.ngrok.com/domains)_**, copy the domain as value of `NGROK_DOMAIN` inside `.env`
5. Configure Clerk webhook endpoint with the ngrok URL:

- URL: `<ngrok-domain>/api/auth/webhook`
- Events: `user.created`, `user.deleted`, `user.updated`

6. Configure Paddle webhook endpoint with the ngrok URL:

- URL: `<ngrok-domain>/api/billing/webhook`
- Events: `subscription.created`, `subscription.updated`, `subscription.canceled`

## Run the project

```bash
pnpm dev:all
```

You can now visit `http://localhost:3000` to see the project and test webhooks.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
