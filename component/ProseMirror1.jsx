"use client"

import React, { useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import {
    addMentionNodes,
    addTagNodes,
    getMentionsPlugin
} from "prosemirror-mentions";
import "./ProseMirror.css"

// Create schema
const schema = new Schema({
    nodes: addTagNodes(addMentionNodes(basicSchema.spec.nodes)),
    marks: basicSchema.spec.marks
});

const getMentionSuggestionsHTML = (items, activeIndex) =>
    '<div class="suggestion-item-list">' +
    items.map((item, index) =>
        `<div class="suggestion-item ${index === activeIndex ? 'active' : ''}">${item.name}</div>`
    ).join("") +
    "</div>";

const getTagSuggestionsHTML = items =>
    '<div class="suggestion-item-list">' +
    items.map(i => '<div class="suggestion-item">' + i.tag + "</div>").join("") +
    "</div>";

// Initialize mention plugin
const mentionPlugin = getMentionsPlugin({
    getSuggestions: (type, text, done) => {
        setTimeout(() => {
            if (type === "mention") {
                // Pass dummy mention suggestions
                done([
                    { name: "John Doe", id: "101", email: "joe@gmail.com" },
                    { name: "Joe Lewis", id: "102", email: "lewis@gmail.com" }
                ]);
            } else {
                // Pass dummy tag suggestions
                done([{ tag: "WikiLeaks" }, { tag: "NetNeutrality" }]);
            }
        }, 0);
    },
    getSuggestionsHTML: (items, type) => {
        if (type === "mention") {
            return getMentionSuggestionsHTML(items);
        } else if (type === "tag") {
            return getTagSuggestionsHTML(items);
        }
    }
});

const ProseMirror1 = () => {
    const editorRef = useRef(null);
    const contentRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && contentRef.current) {
            // Initialize plugins
            const plugins = exampleSetup({ schema: schema });
            plugins.unshift(mentionPlugin); // Push mention plugin

            // Create editor view
            viewRef.current = new EditorView(editorRef.current, {
                state: EditorState.create({
                    doc: DOMParser.fromSchema(schema).parse(contentRef.current),
                    plugins: plugins
                })
            });

            // Cleanup when the component is unmounted
            return () => {
                if (viewRef.current) {
                    viewRef.current.destroy();
                }
            };
        }
    }, []);

    return (
        <div>
            <div ref={contentRef} style={{ display: "none" }}>
                <p>Start typing and use mentions or tags!</p>
            </div>
            <div ref={editorRef} id="editor" />
        </div>
    );
};

export default ProseMirror1;
