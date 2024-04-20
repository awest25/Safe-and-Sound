import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import mapboxgl from "mapbox-gl";

import Dashboard from "./routes/dashboard";
import stylesheet from "~/tailwind.css?url";

mapboxgl.accessToken = "pk.eyJ1IjoiYWp0YWRlbyIsImEiOiJjbHY4Ym56czMwMzJmMmlyeXJpaGx3aHBoIn0.oMQb-_b4NrGmhtVkwn-O1Q"

// tainwind css styling
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Dashboard />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
