const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const store = getStore("finbot");

  if (event.httpMethod === "GET") {
    try {
      const txs = await store.get("transactions", { type: "json" });
      const hist = await store.get("history", { type: "json" });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txs: txs || [], hist: hist || [] })
      };
    } catch {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txs: [], hist: [] })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      if (body.txs !== undefined) await store.setJSON("transactions", body.txs);
      if (body.hist !== undefined) await store.setJSON("history", body.hist);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true })
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: e.message })
      };
    }
  }

  return { statusCode: 405, body: "Method not allowed" };
};
