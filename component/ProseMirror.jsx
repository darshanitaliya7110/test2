"use client"

import React, { useEffect, useState } from 'react'
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import "./ProseMirror.css"

const ProseMirror = () => {
    const [editorContent, setEditorContent] = useState("");
    console.log("Data", editorContent)

    useEffect(() => {
        // Check if the editor is already initialized
        if (window.view) return;

        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
        })

        const editorElement = document.querySelector("#editor");
        const contentElement = document.querySelector("#content");

        if (editorElement && contentElement) {
            window.view = new EditorView(editorElement, {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(mySchema).parse(contentElement),
                    plugins: exampleSetup({ schema: mySchema })
                })
            })
        }

        // Cleanup function to prevent reinitialization
        return () => {
            if (window.view) {
                window.view.destroy();
                window.view = null;
            }
        };
    }, []);

    // Function to get the current editor content as HTML
    const getEditorContent = () => {
        if (window.view) {
            const doc = window.view.state.doc;
            const fragment = DOMSerializer.fromSchema(window.view.state.schema).serializeFragment(doc.content);
            const div = document.createElement("div");
            div.appendChild(fragment);
            setEditorContent(div.innerHTML); // Set the editor content to state
        }
    };

    return (
        <>
            <div id="editor"></div>
            <div id="content"></div>
            <button onClick={getEditorContent}>Get Editor Content</button>
        </>
    )
}

export default ProseMirror;
