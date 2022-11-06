const smartTrim = (str, trimLength, delim, trimAppendix) => {
  if (str <= trimLength) return str;
  let trimmedStr = str.substr(0, trimLength + delim.length);
  let trimmedStrLastIndex = trimmedStr.lastIndexOf(delim);
  if (trimmedStrLastIndex >= 0)
    trimmedStr = trimmedStr.substr(0, trimmedStrLastIndex) + trimAppendix;
  if (trimmedStrLastIndex == -1) trimmedStr = trimmedStr + trimAppendix + delim;
  return trimmedStr;
};

module.exports = smartTrim;


/**
 * "<h2>Introduction</h2>..</p>".replace(/<\/*[a-zA-Z0-9]+>/g, ' ').replace(/^\s|\s$/g, '').split(/\s+/)
 */