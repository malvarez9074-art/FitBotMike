import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("finbot");
  if (req.method === "GET") {
    try {
      const txs = await store.get("transactions", { type: "json" });
      const hist = await store.get("history", { type: "json" });
      return Response.json({ txs: txs || [], hist: hist || [] });
    } catch {
      return Response.json({ txs: [], hist: [] });
    }
  }
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.txs !== undefined) await store.setJSON("transactions", body.txs);
      if (body.hist !== undefined) await store.setJSON("history", body.hist);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ ok: false, error: e.message }, { status: 500 });
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/data" };
