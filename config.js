module.exports = {
  TELEMETRY_API_URL: process.env.TELEMETRY_API_URL || 'https://agco-fuse-trackers-sandbox.herokuapp.com',
  DEFAULT_CAN_VARIABLES: [
    'ENGINE_HOURS',
    'ENGINE_SPEED',
    'DRIVING_DIRECTION',
    'MASTER_APPLY',
    'FUEL_LEVEL',
    'FUEL_RATE',
    'ENGINE_LOAD',
    'MOISTURE_AVERAGE',
    'YIELD_AVERAGE',
    'CAPACITY_Average',
    'TEST_WEIGHT',
    'HARVEST_HOURS',
    'RATE',
    'UNLOAD_AUGER_STATUS',
    'BALE_WEIGHT',
    'BALE_WEIGHT_Average',
    'BALE_FLAKES_Average',
    'COUNTER_Bale_Cut',
    'COUNTER_Bale_Uncut',
    'GRAIN_LOSS_Shaker',
    'GRAIN_LOSS_Rotor',
    'INDUSTRIAL_DRIVE_ENGAGE',
    'PRIMARY_EXTRACTOR_ENGAGE',
    'SIEVE_POSITION_Upper_Right',
    'STROKE_PER_FLAKE',
    'TOPPER_DRIVE_ENGAGE'
  ],
  HAPI_SWAGGER_CONFIG: {
    schemes: ['https'],
    enableDocumentation: true,
    documentationPath: '/docs',
    auth: false,
    lang: 'en',
    info: {
      title: 'Equipment API Documentation',
      description: 'A Telemetry API Façade that exposes Equipments as first-class citizens',
      termsOfService: 'An example of terms of service',
      contact: {
        name: 'AGCO Fuze',
        url: 'http://www.agcotechnologies.com/developers/',
        email: 'FuseInfo@agcocorp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      version: '1.0.0'
    }
  },
  PORT: process.env.PORT || 9090
};
