import marked from 'marked';

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
}
