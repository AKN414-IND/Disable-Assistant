import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Input, Button, Spin, Typography } from 'antd';

const { Title } = Typography;

function GeminiInReact() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyDk8wuM0Qi5IRS17Z4RRuT8oFcopPMQrl8"
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) {
      alert("Please enter a value before submitting.");
      return;
    }

    try {
      setLoading(true);
      let prompt = `Based on the following disabilities and abilities: "${inputValue}", suggest a list of jobs that a person can do.`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("API Response:", text);

      setPromptResponses([...promptResponses, text]);
      setInputValue('');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("An error occurred while fetching the response. Please try again.");
    }
  };

  const formatResponse = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^\*\s+/g, '');
      return (
        <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="container">
      <Title level={2} className="text-center mb-4">Job Suggestion Assistant</Title>
      <div className="row">
        <div className="col">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="List your disabilities and abilities..."
            aria-label="User input for disabilities and abilities"
          />
        </div>
        <div className="col-auto">
          <Button type="primary" onClick={getResponseForGivenPrompt}>Send</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center mt-3">
          <Spin tip="Loading your response..." />
        </div>
      ) : (
        promptResponses.length > 0 && (
          <div className="mt-3">
            {formatResponse(promptResponses[promptResponses.length - 1])}
          </div>
        )
      )}
    </div>
  );
}

export default GeminiInReact;
