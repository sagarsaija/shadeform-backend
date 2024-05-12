## Getting Started

Make sure to be running the shadeform-frontend code first. Look at the frontend README to launch the client.

Go to https://platform.shadeform.ai/settings/api and create a shadeform API key.

Duplicate the .env.sample file and rename it to .env.local. Insert your shadeform API key in the NEXT_PUBLIC_SHADEFORM_API_KEY in the .env.local file.

Install and run the development server:

```
npm i
npm run dev
```

The server should be running on http://localhost:3001

## Specs

Used Node.js and express to build the backend. The data is stored in memory so it will be deleted when the server is shut down.
