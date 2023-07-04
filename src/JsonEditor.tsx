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

export interface EditorProps {
    code: string;
    onChange: (newCode: string) => void;
    onObjectFieldClick: (fieldPath: string) => void;
}

export const JsonEditor: React.FC<EditorProps> = ({ code, onChange, onObjectFieldClick }) => {
    const toJsonSchema = require('to-json-schema');
    const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

    const editorDidMount: EditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        editor.onMouseDown((e) => {
            const model = editor.getModel();
            if (model) {
                const position = e.target.position;
                if (position) {
                    const wordAtPosition = model.getWordAtPosition(position);
                    if (wordAtPosition) {
                        const fieldName = wordAtPosition.word;
                        const fieldValue = getFieldValue(model, position);

                        console.log('Field name: ' + fieldName)
                        console.log('Field type: ' + typeof fieldValue)
                        console.log(JSON.stringify(fieldValue, null, 2));
                        console.log(toJsonSchema(fieldValue));

                    }
                }
            }
        });
        editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
        });
    };

    const getFieldValue = (model: monacoEditor.editor.ITextModel, position: monacoEditor.Position): any => {
        const lineNumber = position.lineNumber;
        const lineContent = model.getLineContent(lineNumber);
        const fieldStart = lineContent.lastIndexOf('"', position.column - 2) + 1;
        const fieldEnd = lineContent.indexOf('"', position.column - 1);
        const fieldName = lineContent.slice(fieldStart, fieldEnd);
        const jsonCode = model.getValue();

        try {
            const parsedJson = JSON.parse(jsonCode);
            const fieldPath = model.getValueInRange({
                startLineNumber: lineNumber,
                startColumn: fieldStart + 1,
                endLineNumber: lineNumber,
                endColumn: fieldEnd + 1,
            });
            const fieldPathParts = fieldPath.split('.');
            const fieldValue = fieldPathParts.reduce((obj, key) => obj[key], parsedJson);
            return fieldValue;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
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