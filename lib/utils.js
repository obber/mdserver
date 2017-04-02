import marked from 'marked';
import { find } from 'lodash';

export const hasMdExtension = (path) => {
  const ext = path.split('').slice(-3).join('');
  return ext === '.md';
}

export const sendFile = (content, tree, res) => {
  if (content) {
    res.render('page', {
      tree,
      title: 'req.url',
      content: marked(content)
    });
  } else {
    res.render('404', {
      tree,
      title: '404',
      content: 'that file does not exist'
    });
  }
}

export const sendError = (status, content, res) => {
  res.render('404', {
    title: status,
    content
  });
};

export const indexTree = (tree, depth) => {
  const newTree = Object.assign({}, tree);
  newTree.children = [];
  const children = tree.children || [];
  // check if index.md exists as a child of current tree
  newTree.indexed = !!find(children, child => child.name === 'index.md');
  // set the depth for appropriate <li> indentation
  newTree.depth = depth;

  // copy or recursively copy each child
  children.forEach(child => {
    if (child.children) {
      newTree.children.push(indexTree(child, depth + 1));
    } else {
      child.depth = depth + 1;
      newTree.children.push(Object.assign({}, child));
    }
  });

  return newTree;
};
