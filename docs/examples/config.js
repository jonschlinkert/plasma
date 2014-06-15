
// Set the config for plasma
var configDefaults = [
  {namespace: 'pkg', patterns: 'package.json'},
  {namespace: 'site', patterns: '.assemblerc.yml'},
  {namespace: ':basename', patterns: options.data}
];

// Load in config data.
var config = plasma.load(configDefaults);