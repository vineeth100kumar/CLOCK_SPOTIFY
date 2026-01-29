const querystring = require("querystring");

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;

  const body = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  // 🔥 PRINT REFRESH TOKEN TO LOGS (IMPORTANT)
  console.log("REFRESH_TOKEN:", data.refresh_token);

  return {
    statusCode: 200,
    body:
      "Spotify connected. Copy refresh token from Netlify logs and save it as an environment variable.",
  };
};
