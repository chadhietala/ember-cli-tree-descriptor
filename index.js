'use strict';

var mergeTrees = require('broccoli-merge-trees');
var walkSync = require('walk-sync');

function TreeDescriptor(options) {
  this.trees = {};
  this.trees[options.treeType] = options.tree;
  this._treeTypes = [options.treeType];
  this.packageName = options.packageName;
  this.name = options.name;
  this.srcDir = options.srcDir;
  this.root = options.root;
  this.pkg = options.pkg;
  this.nodeModulesPath = options.nodeModulesPath;
  this.relativePaths = [];
}

TreeDescriptor.prototype.update = function(newDescriptor) {
  var treeType = newDescriptor._treeTypes[0];
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

TreeDescriptor.prototype.updateRelativePaths = function() {
  this.relativePaths = walkSync(this.srcDir);
};

module.exports = TreeDescriptor;
