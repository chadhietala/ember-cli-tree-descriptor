'use strict';

var mergeTrees = require('broccoli-merge-trees');
var walkSync = require('walk-sync');

function TreeDescriptor(options) {
  this.trees = {};
  if (options.treeType) {
    this.trees[options.treeType] = options.tree;
  }
  this._treeTypes = [options.treeType];
  this.packageName = options.packageName;
  this.name = options.name;
  this.aliases = options.aliases;
  this.srcDir = options.srcDir;
  this.root = options.root;
  this.pkg = options.pkg;
  this.nodeModulesPath = options.nodeModulesPath;
  this.relativePaths = [];
}

TreeDescriptor.prototype.update = function(newDescriptor) {
  var treeType = newDescriptor._treeTypes[0];
  var aliases = newDescriptor.aliases || {};
  this.aliases = this._addAliases(this.aliases, aliases);
  this._treeTypes = this._treeTypes.concat(newDescriptor._treeTypes);
  if (!this.trees[treeType]) {
    this.trees[treeType] = newDescriptor.trees[treeType];
  } else {
    this.trees[treeType] = mergeTrees([
      this.trees[treeType],
      newDescriptor.trees[treeType]
    ], { overwrite: true });
  }
};

/**
 * Adds aliases to the existing tree descriptor.
 * @param  {Object|undefined} currentAliases Current aliases if we have them
 * @param  {Object} newAliases     New aliases
 * @return {Object}                aliases
 */
TreeDescriptor.prototype._addAliases = function(currentAliases, newAliases) {
  if (!currentAliases) {
    return newAliases;
  }
  var aliases = {};

  Object.keys(newAliases).forEach(function(alias) {
    if (!currentAliases[alias]) {
      aliases[alias] = newAliases[alias];
    }
  });

  Object.keys(currentAliases).forEach(function(alias) {
    aliases[alias] = currentAliases[alias];
  });

  return aliases;

};

TreeDescriptor.prototype.updateRelativePaths = function() {
  this.relativePaths = walkSync(this.srcDir);
};

module.exports = TreeDescriptor;
