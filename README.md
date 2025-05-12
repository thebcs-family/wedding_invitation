# Wedding Website ❤️


This is the website for our wedding, deployed on GitHub Pages at [fedececy.com](https://fedececy.com) (without domain name it would be on Github . io [here](https://thebcs-family.github.io/wedding_invitation)).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun (package manager of your choice)

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/thebcs-family/wedding_invitation.git
cd wedding_invitation
```

2. Install dependencies (npm, yarn, pnpm, or bun):
```bash
npm install
```

3. We use Firebase for collecting RSVPs, and Kakao Map for the map. Create the required secrets file:


```bash
mkdir -p app/config
cat > app/config/secrets.ts << 'EOF'
export const secrets = {
  firebase: {
    apiKey: "dummy-firebase-api-key",
    authDomain: "dummy-project.firebaseapp.com",
    projectId: "dummy-project",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    measurementId: "G-ABCDEF"
  },
  kakao: {
    javascriptKey: "dummy-kakao-javascript-key",
    mapApiKey: "dummy-kakao-map-key"
  }
}; 
EOF
```

4. Start the development server (npm, yarn, pnpm, or bun):
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: The secrets file contains dummy values. For production deployment, you'll need to replace these with actual API keys for Firebase and Kakao services.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
