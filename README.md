# Next.js Starter Template Paddle

A modern full-stack starter template with authentication, database, payments, and UI components.

## Tech Stack

| Category  | Technology            |
| --------- | --------------------- |
| Framework | Next.js               |
| CSS       | Tailwind CSS          |
| UI        | Shadcn UI             |
| Auth      | Clerk                 |
| Database  | Supabase (PostgreSQL) |
| ORM       | Prisma                |
| Payments  | Paddle                |

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
You need to initialize Clerk, Supabase and Paddle projects.

3. **Initialize Database**

```bash
pnpm dlx prisma migrate dev --name init
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
│   ├── data/
│   │   └── subscription/
│   │   └── user/
│   ├── paddle/get-paddle-instance.ts
│   ├── db.ts
│   └── typeguards.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
├── .env
└── .env.example
```

## Webhook Setup

1. Install ngrok for local development:

```bash
npm install -g ngrok
ngrok http 3000
```

2. Configure Clerk webhook endpoint with the ngrok URL:

   - URL: `<ngrok-url>/api/auth/webhook`
   - Events: `user.created`, `user.deleted`, `user.updated`

3. Configure Paddle webhook endpoint with the ngrok URL:
   - URL: `<ngrok-url>/api/billing/webhook`
   - Events: `subscription.created`, `subscription.updated`, `subscription.canceled`

## Run the project

```bash
pnpm dev
```

You can now visit `http://localhost:3000` to see the project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
