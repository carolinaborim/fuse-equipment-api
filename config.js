module.exports = {
  TELEMETRY_API_URL: process.env.TELEMETRY_API_URL || 'https://agco-fuse-trackers-sandbox.herokuapp.com',
  DEFAULT_CAN_VARIABLES: [
    'ENGINE_HOURS',
    'ENGINE_SPEED',
    'DRIVING_DIRECTION'
  ]
};
