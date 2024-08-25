import React, { useState } from 'react';
import Select from 'react-select';
import './App.css'; // Import the CSS file

// Options for the select dropdown
const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
];

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (error) {
      console.error('Invalid JSON:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJson(jsonInput)) {
      setIsValidJson(true);
      const parsedJson = JSON.parse(jsonInput);

      try {
        const response = await fetch('https://newbajajbackend.onrender.com/bfhl', { // Update this URL to your actual API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedJson),
        });

        const data = await response.json();
        setApiResponse(data);
        setSelectedOptions([])
        setFilteredResponse(data.filteredData);
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    } else {
      setIsValidJson(false);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);

    if (apiResponse) {
      const filtered = {};

      selected.forEach((option) => {
        switch (option.value) {
          case 'alphabets':
            filtered.alphabets = apiResponse.alphabets;
            break;
          case 'numbers':
            filtered.numbers = apiResponse.numbers;
            break;
          case 'highest_lowercase_alphabet':
            filtered.highest_lowercase_alphabet = apiResponse.highest_lowercase_alphabet;
            break;
          default:
            break;
        }
      });

      setFilteredResponse(filtered);
    }
  };

  return (
    <div className="app-container">
      <h1 className="header">JSON Input and API Response</h1>
      
      <textarea
        className="json-input"
        placeholder="Enter JSON here"
        value={jsonInput}
        onChange={handleJsonInputChange}
        rows={10}
      />
      
      <button className="submit-button" onClick={handleSubmit} >Submit</button>
      
      {!isValidJson && <p className="error-message">Invalid JSON format!</p>}
      
      {apiResponse && (
        <div className="response-container">
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={handleSelectChange}
            className="select-dropdown"
          />
          
          {filteredResponse && (
            <div className="filtered-response">
              <h3>Filtered Response:</h3>
              <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;