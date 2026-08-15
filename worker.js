const CODE_ADMIN = "2028";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ─────────────────────────────
    // GET /api/favoris
    // Tout le monde peut lire les favoris
    // ─────────────────────────────
    if (url.pathname === "/api/favoris" && request.method === "GET") {
      const { results } = await env.DB
        .prepare("SELECT eglise_id FROM favoris ORDER BY id")
        .all();

      return Response.json(
        results.map((row) => row.eglise_id)
      );
    }

    // ─────────────────────────────
    // POST /api/favoris
    // Ajouter / retirer un favori
    // ─────────────────────────────
    if (url.pathname === "/api/favoris" && request.method === "POST") {
      try {
        const data = await request.json();

        if (data.code !== CODE_ADMIN) {
          return Response.json(
            { error: "Code incorrect" },
            { status: 401 }
          );
        }

        const id = String(data.id || "").trim();

if (!id) {
  return Response.json(
    { error: "ID d'église invalide" },
    { status: 400 }
  );
}

        if (data.action === "add") {
          await env.DB
            .prepare(
              "INSERT OR IGNORE INTO favoris (eglise_id) VALUES (?)"
            )
            .bind(id)
            .run();
        }

        if (data.action === "remove") {
          await env.DB
            .prepare(
              "DELETE FROM favoris WHERE eglise_id = ?"
            )
            .bind(id)
            .run();
        }

        const { results } = await env.DB
          .prepare("SELECT eglise_id FROM favoris ORDER BY id")
          .all();

        return Response.json(
          results.map((row) => row.eglise_id)
        );

      } catch (error) {
        return Response.json(
          { error: "Requête invalide" },
          { status: 400 }
        );
      }
    }

    // ─────────────────────────────
    // Ton site React
    // ─────────────────────────────
    return env.ASSETS.fetch(request);
  },
};