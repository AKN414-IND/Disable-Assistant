import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Input, Button, Spin } from 'antd';
import "./Future.css";

function GeminiInReact() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAxqj-vV35poWZcHzWzigLvjCH8R_dglUc"
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) {
      alert("Please enter your abilities and disabilities.");
      return;
    }

    try {
      setLoading(true);
      let prompt = `Based on the following disabilities and abilities: "${inputValue}", suggest a list of jobs that a person can do.`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setPromptResponses([...promptResponses, text]);
      setInputValue('');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  const formatResponse = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\*\s+/g, '');
      return (
        <div key={index} className="suggestion-item" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="professionals-page">
      <div className="container">
        <h1>Job Suggestion Assistant</h1>
        <p className="subtitle">Find suitable job recommendations based on your abilities</p>

        <div className="input-container">
          <div className="input-group">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Describe your abilities and disabilities..."
              className="custom-input"
              aria-label="User input for abilities and disabilities"
              onPressEnter={getResponseForGivenPrompt}
            />
            <Button 
              type="primary" 
              onClick={getResponseForGivenPrompt}
              className="submit-button"
            >
              Get Suggestions
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <Spin tip="Analyzing and generating suggestions..." />
          </div>
        ) : promptResponses.length > 0 && (
          <div className="suggestions-container">
            <div className="professional-card">
              <div className="professional-info">
                <h3>Job Suggestions</h3>
                <div className="suggestions-list">
                  {formatResponse(promptResponses[promptResponses.length - 1])}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeminiInReact;