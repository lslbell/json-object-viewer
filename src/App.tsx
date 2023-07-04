import React from 'react';
import logo from './logo.svg';
import './App.css';
import { JsonEditor } from './JsonEditor';

function App() {
  const [code, setCode] = React.useState<string>('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    console.log(newCode)
  };

  const handleObjectFieldClick = (fieldPath: string) => {
    console.log('Clicked on object field:', fieldPath);
  };

  return (
    <div>
      <h1>Monaco Editor Example</h1>
      <JsonEditor
        code={code}
        onChange={handleCodeChange}
        onObjectFieldClick={handleObjectFieldClick}
      />
    </div>
  );
};

export default App;
