import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';

export const mockJson = {
    username: "Bob Jim",
    age: 50,
    address: {
        line1: "Big city street",
        line2: "Livi",
        postcode: {
            region: 'eh50',
        }
    }
}


export const JsonEditor = () => {
    const toJsonSchema = require('to-json-schema');
    const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

    const editorDidMount: EditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        editor.onMouseDown((event) => {
            const model = editor.getModel();
            if (model) {
                const position = event.target.position;
                if (position) {
                    const wordAtPosition = model.getWordAtPosition(position);
                    if (wordAtPosition) {
                        const fieldName = wordAtPosition.word;

                        let json = JSON.parse(model.getValue());
                        const fieldValue = getFieldValue(json, position, fieldName); //pass in too much of model?

                        // console.log('Field name: ' + fieldName)
                        // console.log(JSON.stringify(fieldValue, null, 2));
                        // console.log(toJsonSchema(fieldValue));

                    }
                }
            }
        });
    };

    const getFieldValue = (json: any, position: monacoEditor.Position, fieldName: string): any => {
        //traverse model, but can we make use of line pos -- ie 2 diff serviceRequestBlocks :/ -- sol: traverse and verify line position hehehe

        for (let key in json) {
            if (key === fieldName) {
                console.log('found')
                console.log(json[key]);

                return;
            }
            else if (typeof json[key] === 'object') {
                getFieldValue(json[key], position, fieldName)
            }  else if (Array.isArray(json[key])) {
                getFieldValue(json[key], position, fieldName)
            } 
        }

    };

    return (
        <MonacoEditor
            width="800"
            height="600"
            language="json"
            theme="vs-dark"
            value={JSON.stringify(mockJson, null, 2)}
            editorDidMount={editorDidMount}
        />
    );
};