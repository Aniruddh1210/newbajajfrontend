import React, { useState } from 'react';
import Select from 'react-select';

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
        if (option.value === 'alphabets') {
          filtered.alphabets = apiResponse.alphabets;
        } else if (option.value === 'numbers') {
          filtered.numbers = apiResponse.numbers;
        } else if (option.value === 'highest_lowercase_alphabet') {
          filtered.highest_lowercase_alphabet = apiResponse.highest_lowercase_alphabet;
        }
      });

      setFilteredResponse(filtered);
    }
  };

  return (
    <div className="App">
      <h1>JSON Input and API Response</h1>
      <textarea
        placeholder="Enter JSON here"
        value={jsonInput}
        onChange={handleJsonInputChange}
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format!</p>}

      {apiResponse && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
          />
          <div>
            <h3>Filtered Response:</h3>
            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
