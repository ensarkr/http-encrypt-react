# http-encrypt-react

## About

React app that shows random movies to signed in users. All http requests are encrypted. Uses express for backend. [Backend repository.](https://github.com/ensarkr/http-encrypt-express)

## Features

- Signed in users can see random movies.
- Http requests are encrypted via AES-CBC.
- Shared private key created via ECDH, uses prime256v1 curve.
- It uses browserified node crypto modules instead of crypto.subtle because crypto.subtle needs https (secure context).

Check [backend repo](https://github.com/ensarkr/http-encrypt-express) to see long description of encryption process.

## Routes

- Home - See random movies.
- Sign In
- Sign Up

## Preview

Check this [folder](https://github.com/ensarkr/readme-image-storage/tree/main/http-encrypt-react) for website images.

## To Run Locally

Firstly you must setup [my backend](https://github.com/ensarkr/http-encrypt-express).
Then change VITE_API_URL in .env file to the url that you serve backend api.

```
$ npm install
$ npm run dev
```

After this, app is accessible on http://localhost:5173/

## Technologies

- TypeScript
- React
- Tanstack Router
- Browserify


## Q&A
1. What are _needs_secure_context suffix in some files?

I used crypto.subtle before noticing it needed secure context. Noticed that near project completion therefore instead of deleting crypto.subtle versions I added suffix to those files. Can be switched to that version if you delete suffixes by the time I wrote this README.
