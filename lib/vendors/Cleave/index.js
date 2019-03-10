function configure(config) {
  const {baseUrl} = config.aurelia.environment ? config.aurelia.environment : {baseUrl: '/'};

  config.globalResources(
    `${baseUrl}lib/vendors/Cleave/date-mask.js`,
    `${baseUrl}lib/vendors/Cleave/input-mask.js`,
  );
}

export { configure };
