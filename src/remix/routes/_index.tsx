import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react"
import { ClientOnly } from "remix-utils/client-only";
import Captions from "~/components/Captions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Recording captions:</h1>
      <ClientOnly>
        {() => {
          return (
            <Captions />
          )
        }}
      </ClientOnly>
    </div>
  );
}
