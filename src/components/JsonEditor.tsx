// IMPORTS
import * as React from 'react';

//monaco code editor
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { EditorDidMount, MonacoEditorProps } from 'react-monaco-editor';

//json schema to form
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

//bootstrap
import { Container, Row, Col } from 'react-bootstrap';

//import json example
import jsonExample from '../json_examples/example.json'

export const JsonEditor = () => {
    const toJsonSchema = require('to-json-schema');
    const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const [schema, setSchema] = React.useState<JSONSchema7>({});
    const [fieldName, setFieldName] = React.useState<string>("");
    const [formData, setFormData] = React.useState<any>({});
    const [editorData, setEditorData] = React.useState<any>(JSON.stringify(jsonExample, null, 2));

    const editorOptions: MonacoEditorProps['options'] = {
        readOnly: true,
    };

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
                        const fieldValue = getFieldValue(json, position, fieldName);
                    }
                }
            }
        });
    };

    const getFieldValue = (json: any, position: monacoEditor.Position, fieldName: string): any => {
        //need to verify line pos

        for (let key in json) {
            if (key === fieldName) {
                setFieldName(key)
                setSchema(toJsonSchema(json[key]));
                setFormData(json[key]);

                return;
            }
            else if (typeof json[key] === 'object') {
                getFieldValue(json[key], position, fieldName)
            }
            else if (Array.isArray(json[key])) {
                getFieldValue(json[key], position, fieldName)
            }
        }

    };

    const setFieldValue = (json: any, position: any, fieldName: string, value: any): any => { // refactor -- position: monacoEditor.Position
        //need to verify line pos

        for (let key in json) {
            if (key === fieldName) {
                //update json with new field value
                

                return;
            }
            else if (typeof json[key] === 'object') {
                getFieldValue(json[key], position, fieldName)
            }
            else if (Array.isArray(json[key])) {
                getFieldValue(json[key], position, fieldName)
            }
        }
    };

    const handleSubmit = (data: any) => {
        console.log(data.formData);
        console.log(formData);
        setFieldValue(formData, 0, fieldName, data.formData);       
    }

    return (
        <div className="container-fluid">
            <div className="row-fluid">
                <div className="col-xs-6">
                    <h1>Generated Form Example</h1>
                    <Form
                        formData={formData}
                        schema={schema}
                        onSubmit={handleSubmit}
                        onError={console.error}
                        validator={validator}
                    />
                </div>
                <div className="col-xs-6">
                    <h1>Editor Example</h1>
                    <MonacoEditor
                        width="800"
                        height="600"
                        language="json"
                        theme="vs-dark"
                        value={editorData}
                        editorDidMount={editorDidMount}
                        options={editorOptions}
                    />
                </div>
            </div>
        </div >
    );
};