"use client"

// components/ChatWithMentions.js

import React, { useState } from 'react';

const users = ['John Doe', 'Jane Smith', 'David Brown', 'Alice Johnson']; // Example user list

const ChatWithMentions = () => {
    const [message, setMessage] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);

    const handleChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // Detect if the "@" symbol was typed
        const lastChar = value.slice(-1);
        if (lastChar === '@') {
            setShowSuggestions(true);
            setMentionStartIndex(value.length - 1); // Save the index of '@'
            setSuggestions(users); // Show all users initially
        } else if (mentionStartIndex !== -1 && value.length > mentionStartIndex + 1) {
            // Filter suggestions based on the text after "@"
            const searchText = value.slice(mentionStartIndex + 1).toLowerCase();
            const filteredUsers = users.filter(user => user.toLowerCase().includes(searchText));
            setSuggestions(filteredUsers);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectMention = (user) => {
        // Replace "@" and the text after it with the selected user
        const updatedMessage =
            message.slice(0, mentionStartIndex) + `@${user} ` + message.slice(mentionStartIndex + 1);
        setMessage(updatedMessage);
        setShowSuggestions(false);
        setMentionStartIndex(-1);
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={handleChange}
                placeholder="Type your message..."
                rows={4}
                style={{ width: '100%', padding: '8px' }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-list">
                    {suggestions.map((user, index) => (
                        <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSelectMention(user)}
                        >
                            {user}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatWithMentions;