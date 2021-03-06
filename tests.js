'use strict';

var TreeDescriptor = require('./index');
var expect = require('chai').expect;
var path = require('path');

describe('tree descriptor model', function() {
  var treeDescriptor;

  beforeEach(function() {
    treeDescriptor = new TreeDescriptor({
      tree: 'foo',
      treeType: 'app',
      packageName: 'foo',
      name: 'fizzpoo',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });
  });

  it('should setup a trees hash keyed off of the type', function() {
    expect(treeDescriptor.trees.app).to.eql('foo');
  });

  it('should hold an array of tree types', function() {
    expect(treeDescriptor._treeTypes).to.deep.eql(['app']);
  });

  it('should update the existing instance', function() {
    var newDesc = new TreeDescriptor({
      tree: 'bizz',
      treeType: 'addon',
      packageName: 'foo',
      name: 'fizzpoo',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });

    treeDescriptor.update(newDesc);
    expect(treeDescriptor._treeTypes).to.deep.eql(['app', 'addon']);
    expect(treeDescriptor.trees.app).to.deep.eql('foo');
    expect(treeDescriptor.trees.addon).to.deep.eql('bizz');
  });

  it('should merge the trees if it is updated a tree of the same type exists4', function() {
    var newDesc = new TreeDescriptor({
      tree: 'bizz',
      treeType: 'app',
      packageName: 'foo',
      name: 'fizzpoo',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });

    treeDescriptor.update(newDesc);
    expect(treeDescriptor.trees.app._inputNodes).to.deep.eql(['foo', 'bizz']);
  });

  it('should add aliases if they do not exist', function() {
    var newDesc = new TreeDescriptor({
      tree: 'bizz',
      treeType: 'app',
      packageName: 'foo',
      name: 'fizzpoo',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      aliases: {
        foo: { name: 'foo', treeType: 'test' }
      },
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });

    treeDescriptor.update(newDesc);
    expect(treeDescriptor.aliases).to.deep.eql({
      foo: { name: 'foo', treeType: 'test' }
    });
  });

  it('should add aliases existing alias with curent ones', function() {
    var desc1 = new TreeDescriptor({
      tree: 'bizz',
      treeType: 'app',
      packageName: 'foo',
      name: 'fizzpoo',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      aliases: {
        foo: { name: 'foo', treeType: 'test' }
      },
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });

    var desc2 = new TreeDescriptor({
      tree: 'bizz',
      treeType: 'app',
      packageName: 'foo',
      name: 'fizzpoo/test',
      srcDir: '/',
      pkg: { name: 'foo', version: '12.0.0' },
      root: process.cwd(),
      aliases: {
        bizz: { name: 'bizz', treeType: 'addon' }
      },
      nodeModulesPath: path.join(process.cwd(), 'node_modules')
    });

    desc1.update(desc2);

    expect(desc1.aliases).to.deep.eql({
      foo: { name: 'foo', treeType: 'test' },
      bizz: { name: 'bizz', treeType: 'addon' }
    });
  });
});
