function configure(config) {
  const {baseUrl} = config.aurelia.environment ? config.aurelia.environment : {baseUrl: '/'};

  config.globalResources(
    `${baseUrl}lib/multi-select/multi-select.js`,
    `${baseUrl}lib/multi-select/multi-select-item.js`,
  );
}

export { configure };
