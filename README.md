# Sanity Studio v3 + Remix

- [Sanity Studio v3 Docs](https://beta.sanity.io)
- [Remix Docs](https://remix.run/docs)

## Includes:

- Sanity Studio v3 embedded in the `/studio` route
- Styled Components SSR support for the `/studio` route
- Example Sanity Studio config and schema
- Example Portable Text Component
- Example Image Builder Component
- eslint and Prettier
- Tailwind CSS for the front-end
- Tailwind Prose and Prettier plugins

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Sanity Studio

Visit `https://localhost:3000/studio` in your Remix app. You will need to:

1. Update any `projectId` configs to a project your in your [Sanity Manage](https://sanity.io/manage)
2. Possibly also add `localhost:3000` to the CORS settings on that project

## Your tasks!

Follow the instructions above and:

- [ ] Make sure you can view your Studio at [http://localhost:3000/studio](http://localhost:3000/studio)
- [ ] Optional: Use the "Faker" Tool to generate lots of fake data

Import the Sanity Client and write a GROQ Query for:

- [ ] Products on the home page: `./app/routes/index.tsx`
- [ ] A single Product by its slug: `./app/routes/$slug.tsx`

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
