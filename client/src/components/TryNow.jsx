import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { fetchCategories, fetchAlgorithmsInCategory, fetchAlgorithmDetails } from '../utils/githubApi';
import axios from 'axios';
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const TryNow = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setAlgorithms([]);
    setSelectedAlgorithm(null);
    setCode('');
    try {
      const fetchedAlgorithms = await fetchAlgorithmsInCategory(category);
      setAlgorithms(fetchedAlgorithms);
    } catch (err) {
      console.error('Error fetching algorithms:', err);
    }
  };

  const handleAlgorithmClick = async (algorithm) => {
    setSelectedAlgorithm(algorithm);
    try {
      const details = await fetchAlgorithmDetails(selectedCategory, algorithm);
      setCodeForLanguage(details); // Set the correct code for the initial language
    } catch (err) {
      console.error('Error fetching algorithm details:', err);
    }
  };

  const setCodeForLanguage = (details) => {
    if (language === 'cpp') {
      setCode(details.codeCpp || '');
    } else if (language === 'python') {
      setCode(details.codePy || '');
    }
  };

  const handleCodeChange = (newCode) => setCode(newCode);

  const handleInputChange = (event) => setInput(event.target.value);

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage); // Update the language

    // Fetch and set code based on selected language and algorithm
    if (selectedAlgorithm) {
      try {
        const details = await fetchAlgorithmDetails(selectedCategory, selectedAlgorithm);
        
        // Use the new language to set the code properly
        if (newLanguage === 'cpp') {
          setCode(details.codeCpp || '');
        } else if (newLanguage === 'python') {
          setCode(details.codePy || '');
        }
      } catch (err) {
        console.error('Error fetching code for the new language:', err);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/execute', {
        language,
        code,
        input,
      });
      setOutput(response.data.output || 'No output returned.');
    } catch (err) {
      console.error('Error executing code:', err);
      setOutput('Error occurred while executing the code.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 text-white">
      {/* Categories Sidebar */}
      <div className="lg:w-1/6 w-full bg-slate-800 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer py-1 px-2 rounded ${selectedCategory === category ? 'bg-slate-700' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category
                .split(' ') // Split by space to handle multi-word names
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
                .join(' ')} {/* Capitalized category */}
            </li>
          ))}
        </ul>

        {selectedCategory && (
          <>
            <h2 className="text-lg font-bold mb-4 mt-8">Algorithms</h2>
            <ul>
              {algorithms.map((algorithm) => (
                <li
                  key={algorithm.name}
                  className={`cursor-pointer py-1 px-2 rounded ${selectedAlgorithm === algorithm.name ? 'bg-slate-700' : ''}`}
                  onClick={() => handleAlgorithmClick(algorithm.name)}
                >
                  {algorithm.name
                    .split(' ') // Split by space to handle multi-word names
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
                    .join(' ')} {/* Capitalized algorithm */}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Code Editor and Input/Output Section */}
      <div className="w-full p-4 lg:p-8 flex flex-col lg:flex-row h-full">
        {/* Input / Output Section (2/3 of the width) */}
        <div className="flex flex-col w-full lg:w-1/3 h-screen mb-8 md:mb-0">
          <div className="mb-4 flex-1">
            <textarea
              className="w-full p-2 h-full bg-slate-800 border border-slate-700 rounded-lg text-sm resize-none"
              placeholder="Enter Input Here"
              value={input}
              onChange={handleInputChange}
              rows={10}
            />
          </div>
          <div className="flex-1">
            <textarea
              className="w-full h-full p-2  bg-slate-800 border border-slate-700 rounded-lg text-sm resize-none"
              placeholder="Output will appear here"
              value={output}
              readOnly
              rows={10}
            />
          </div>
        </div>

        {/* Code Editor Section (1/3 of the width) */}
        <div className="flex flex-col w-full h-screen lg:w-2/3 mb-4 lg:mb-0 lg:ml-4">
          <div className="mb-4 flex items-center gap-2">
            <label className="font-semibold">Language:</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-slate-800 text-white p-2 rounded-lg"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Editor container with flex-1 to take full height */}
          <div className="h-full">
            <AceEditor
              mode={language === 'cpp' ? 'c_cpp' : 'python'}
              theme="monokai"
              value={code}
              onChange={handleCodeChange}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              fontSize={16}
              width="100%"  // Adjust width for responsiveness
              height="100%" // Adjust height for responsiveness
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryNow;
