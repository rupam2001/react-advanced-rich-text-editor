import React from 'react';
import Editor2 from './components/editor2';

import { assames } from "./components/language"

export default function App() {
  return (
    <div>
      <Editor2 languages={[assames]} />
    </div>
  )
}