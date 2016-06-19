'use strict';

/**
 * Merges source's properties into the destination object.
 *
 * @param {Object} destination Destination object
 * @param {Object} source Source object
 * @returns {Object} Merged destination object
 */
var merge = function merge(destination, source) {
  for (var attr in source) destination[attr] = source[attr];
  return destination;
};

module.exports = {
  merge: merge
};
