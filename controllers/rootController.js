class RootController {
  options(request, reply) {
    return reply().header('Allow', 'GET');
  }

  findAll(request, reply) {
    return reply({
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
