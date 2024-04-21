# Welcome to Safe-and-Sound!

Safe-and-Sound is an interactive website where you can view the safety of available AirBnBs for rent. We've done the work of extracting, cleaning and transforming meaningful data to be able to acccess for their own aid. Much of our preprocessing is handled through large big-data systems such as Spark (Map-Reduce), pandas for smaller datasets, and mongodb aggregate functions for real-time calculations. The data is then dynamically displayed to the user, where he or she can view a heatmap of the various metrics in real-time. 

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

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

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
