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
      setCodeForLanguage(details);
    } catch (err) {
      console.error('Error fetching algorithm details:', err);
    }
  };

  const setCodeForLanguage = (details) => {
    setCode(language === 'cpp' ? details.codeCpp || '' : details.codePy || '');
  };

  const handleCodeChange = (newCode) => setCode(newCode);

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    if (selectedAlgorithm) {
      try {
        const details = await fetchAlgorithmDetails(selectedCategory, selectedAlgorithm);
        setCode(newLanguage === 'cpp' ? details.codeCpp || '' : details.codePy || '');
      } catch (err) {
        console.error('Error fetching code for the new language:', err);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/execute/run`, {
        language,
        code
      });
      setOutput(response.data.output || 'No output returned.');
    } catch (err) {
      console.error('Error executing code:', err);
      setOutput('Error occurred while executing the code.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      
      {/* Sidebar */}
      <aside className="lg:w-1/5 w-full bg-gray-800 p-6 overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer py-2 px-3 rounded-lg transition ${
                selectedCategory === category ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>

        {selectedCategory && (
          <>
            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-300">Algorithms</h2>
            <ul className="space-y-2">
              {algorithms.map((algorithm) => (
                <li
                  key={algorithm.name}
                  className={`cursor-pointer py-2 px-3 rounded-lg transition ${
                    selectedAlgorithm === algorithm.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handleAlgorithmClick(algorithm.name)}
                >
                  {algorithm.name.charAt(0).toUpperCase() + algorithm.name.slice(1)}
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex flex-col w-full p-6 lg:p-8 h-full">
        
        {/* Controls */}
        <div className="mb-4 flex items-center gap-4">
          <div>
            <label className="text-lg font-semibold mr-2">Language:</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-800 text-white p-2 rounded-lg"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {loading ? 'Running...' : 'Run Code'}
          </button>
        </div>

        {/* Code Editor & Output Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Code Editor */}
          <div className="lg:w-2/3 w-full">
            <h2 className="text-lg font-bold mb-2">Code Editor</h2>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <AceEditor
                mode={language === 'cpp' ? 'c_cpp' : 'python'}
                theme="monokai"
                value={code}
                onChange={handleCodeChange}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                fontSize={16}
                width="100%"
                height="400px"
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:w-1/3 w-full">
            <h2 className="text-lg font-bold mb-2">Output</h2>
            <textarea
              className="w-full h-40 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm resize-none"
              placeholder="Output will appear here"
              value={output}
              readOnly
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default TryNow;
