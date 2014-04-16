
// Set the config for plasma
var configDefaults = [
  {name: 'pkg', src: 'package.json'},
  {name: 'site', src: '.assemblerc.yml'},
  {name: ':basename', src: options.data}
];

// Load in config data.
var config = plasma.load(configDefaults);