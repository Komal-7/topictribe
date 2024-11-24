import React, { useState } from "react";

const CreatePostWithPoll = () => {
    const [pollOptions, setPollOptions] = useState(["", ""]);

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    const addOption = () => setPollOptions([...pollOptions, ""]);

    return (
        <form>
            <input type="text" placeholder="Post Title" />
            <textarea placeholder="Post Content"></textarea>
            <h4>Add Poll</h4>
            <input type="text" placeholder="Poll Question" />
            {pollOptions.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                />
            ))}
            <button type="button" onClick={addOption}>
                Add Option
            </button>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePostWithPoll;
