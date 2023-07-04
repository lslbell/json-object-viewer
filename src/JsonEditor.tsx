import * as React from 'react';

//monaco code editor
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';

//json schema to form
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

//bootstrap
import { Container, Row, Col } from 'react-bootstrap';

export const mockJson = {
    username: "Bob Jim",
    age: 50,
    address: {
        line1: "Big city street",
        line2: "Livi",
        postcode: {
            region: 'eh50',
        }
    },
    accounts: [
        { account1: "personal" },
        { account2: "work" },
    ]
}

export const JsonEditor = () => {
    const toJsonSchema = require('to-json-schema');
    const editorRef = React.useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const [schema, setSchema] = React.useState<JSONSchema7>({});

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
        //traverse model, but can we make use of line pos -- ie 2 diff serviceRequestBlocks :/ -- sol: traverse and verify line position:) 

        for (let key in json) {
            if (key === fieldName) {
                console.log('found')
                console.log(json[key]);
                console.log(JSON.stringify(toJsonSchema(json[key])));

                //set schema value -> gen form
                setSchema(toJsonSchema(json[key]));

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

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Generated Form Example</h1>
                    <Form
                        schema={schema}
                        onSubmit={() => console.log('submitted!')}
                        onError={console.error}
                        validator={validator}
                    />
                </Col>
                <Col>
                    <h1>Editor Example</h1>
                    <MonacoEditor
                        width="800"
                        height="600"
                        language="json"
                        theme="vs-dark"
                        value={JSON.stringify(mockJson, null, 2)}
                        editorDidMount={editorDidMount}
                    />
                </Col>
            </Row>
        </Container>
    );
};