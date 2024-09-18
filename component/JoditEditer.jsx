"use client";

import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";

const JoditEditer = () => {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    console.log("content", content);

    // Dummy mention data
    const mentionData = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Sam Wilson" },
    ];

    // Names array for autocomplete
    const names = [
        "@mary",
        "@jain",
        "@entany",
        "@isaak",
        "@ivan",
        "@fedya",
        "@yakov",
        "@jhon",
        "@lena",
        "@elvin"
    ];

    const config = {
        readonly: false, // Allows editing
        toolbar: true, // Enable the toolbar
        placeholder: "Start typing...",
        showCharsCounter: false, // Hide character counter
        showWordsCounter: false, // Hide word counter
        showXPathInStatusbar: false, // Hide the status bar
        buttons: ["bold", "italic", "underline", "link", "source"], // Toolbar buttons

        // Configure the autocomplete plugin
        extraPlugins: ["autocomplete"], // Enable autocomplete plugin
        events: {
            beforeAutocomplete: (query) => {
                // Check if the query starts with '@' to show mentions or names
                if (query.startsWith("@")) {
                    // Combine mention data and names array for suggestions
                    const mentionSuggestions = mentionData.map((mention) => ({
                        id: mention.id,
                        value: mention.name,
                        label: mention.name,
                    }));

                    const nameSuggestions = names
                        .filter((name) =>
                            name.toLocaleUpperCase().includes(query.toLocaleUpperCase())
                        )
                        .map((name) => ({
                            id: name,
                            value: name,
                            label: name,
                        }));

                    return [...mentionSuggestions, ...nameSuggestions];
                }
                return [];
            },
            autocompleteItemSelect: (value) => {
                // Insert the mention or name into the editor
                return `<span contenteditable="false">${value}</span>&nbsp;`;
            },
        },
        // Configuration for autocomplete
        autocomplete: {
            triggerChar: "@", // Trigger the autocomplete when '@' is typed
            minChars: 1, // Minimum number of characters for suggestions to appear
            delay: 0, // Delay for showing suggestions
            dropdownClassName: "autocomplete-suggestions", // Custom class for the suggestions dropdown
            maxItems: 10, // Max number of suggestions to show

            // Custom match query function for full text search
            isMatchedQuery: (q, value) => {
                value = value.substr(1); // Remove the '@' from the value
                return value.toLocaleUpperCase().includes(q.toLocaleUpperCase());
            },

            sources: [names], // Use the names array for autocomplete
        },
    };

    return (
        <div>
            <h1>Editor</h1>
            <div style={{ border: "2px solid #ccc" }}>
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // Preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {
                        console.log(newContent);
                    }}
                />
            </div>
        </div>
    );
};

export default JoditEditer;
