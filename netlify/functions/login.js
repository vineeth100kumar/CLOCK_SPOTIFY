const querystring = require("querystring");

exports.handler = async () => {
  const scope = "user-read-currently-playing user-read-playback-state";

  const params = querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://accounts.spotify.com/authorize?${params}`,
    },
  };
};
