
// Set the config for plasma
var configDefaults = [
  {namespace: 'pkg', src: 'package.json'},
  {namespace: 'site', src: '.assemblerc.yml'},
  {namespace: ':basename', src: options.data}
];

// Load in config data.
var config = plasma.load(configDefaults);