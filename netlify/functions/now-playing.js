exports.handler = async () => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refreshToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Missing refresh token" }),
    };
  }

  // 1. Get access token using refresh token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
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
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Failed to refresh access token" }),
    };
  }

  // 2. Get currently playing track
  const playbackRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  // Nothing playing
  if (playbackRes.status === 204) {
    return {
      statusCode: 200,
      body: JSON.stringify({ playing: false }),
    };
  }

  const playback = await playbackRes.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      playing: true,
      track: playback.item.name,
      artist: playback.item.artists.map((a) => a.name).join(", "),
      album: playback.item.album.name,
      progress_ms: playback.progress_ms,
      duration_ms: playback.item.duration_ms,
    }),
  };
};
