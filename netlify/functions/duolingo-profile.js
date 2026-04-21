export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const username = event.queryStringParameters?.username;
  if (!username) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing username query parameter" }),
    };
  }

  try {
    const upstream = await fetch(
      `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}`,
      {
        headers: {
          "user-agent": "Mozilla/5.0",
          accept: "application/json",
        },
      }
    );

    if (!upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: `Upstream request failed (${upstream.status})` }),
      };
    }

    const data = await upstream.json();
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
      body: JSON.stringify({ user: data?.users?.[0] || null }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Upstream request failed", details: String(error) }),
    };
  }
};
