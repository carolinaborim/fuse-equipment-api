class RootController {
  options(request, reply) {
    return reply().header('Allow', 'GET');
  }

  findAll(request, reply) {
    return reply({
      meta: {
        description: 'The Equipment API is a façade whose goal is to provide an ' +
          'easier way of retrieving equipment related structured information. ' +
          'The equipment information are retrieved from the Telemetry API and ' +
          'contains the same values, with the structure modeled after the ' +
          'equipment concept.'
      },
      links: {
        self: {
          href: '/',
          type: 'root'
        },
        equipment: {
          href: '/equipment',
          type: 'equipment'
        },
        docs: {
          href: '/docs',
          type: 'documentation'
        }
      }
    });
  }
}

module.exports = RootController;
