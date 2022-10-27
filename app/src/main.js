import React from 'react';
import { createRoot } from 'react-dom/client';
import Editor from './components/editor/editor.js';

createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Editor />
  </React.Fragment>,
);
