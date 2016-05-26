const getAccessToken = () => {
  const forgeRockUser = process.env.FORGE_ROCK_USER;
  const forgeRockPassword = process.env.FORGE_ROCK_PASSWORD;

  const credentials = new Buffer(`${forgeRockUser}:${forgeRockPassword}`).toString('base64');
  return `Basic ${credentials}`;
};

module.exports = {
  TELEMETRY_API_URL: process.env.TELEMETRY_API_URL || 'https://agco-fuse-trackers-sandbox.herokuapp.com',
  FORGE_ROCK_URL: process.env.FORGE_ROCK_URL || 'https://aaat.agcocorp.com',
  FORGE_ROCK_USER: process.env.FORGE_ROCK_USER,
  FORGE_ROCK_PASSWORD: process.env.FORGE_ROCK_PASSWORD,
  FORGE_ROCK_SERVICE_SECRET: process.env.FORGE_ROCK_SERVICE_SECRET,
  ACCESS_TOKEN: getAccessToken()
};
