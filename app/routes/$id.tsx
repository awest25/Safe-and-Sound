// app/routes/listings/[id].tsx
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import connectToDatabase from '../utils/mongodb.js';
import { ObjectId } from 'mongodb';
import DangerList from '~/components/DangerList';

export const loader: LoaderFunction = async ({ params }) => {
  const client = await connectToDatabase();
  const db = client.db("safe-and-sound");
  let listing = await db.collection('airbnb_full').findOne({ _id: new ObjectId(params.id) });
  if (!listing) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ "listing": listing });
};

export default function AirbnbListing() {
  const loaderData = useLoaderData();
  const listing = loaderData.listing;
  
  return (
    <div>
      <h1>{listing.name}</h1>
      <DangerList propertyDocument={listing} />
      {/* Render other details of your listing */}
    </div>
  );
};
