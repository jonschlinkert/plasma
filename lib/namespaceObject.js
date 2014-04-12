var namespaceObject = function(name, src, options) {
  options = options || {};
  name = detectPattern(name);
  var hash = {}, data = {}, len = src.length;

  for (var i = 0; i < len; i++) {
    var filepath = src[i];
    if(options.expand && options.expand === false) {
      hash[name] = filepath;
    } else {
      hash[name] = file.readDataSync(filepath);
    }
    _.merge(data, hash);
  }

  return data;
};