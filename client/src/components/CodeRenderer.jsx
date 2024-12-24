import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AceEditor from 'react-ace'; // Ace editor for code

const CodeRenderer = ({ codeCpp, codePy }) => {
  const [activeTab, setActiveTab] = useState(codeCpp ? "cpp" : "python");

  // Open TryNow tab with the selected code
  const openTryNowTab = (language) => {
    const code = language === "cpp" ? codeCpp : codePy;
    const url = `/try-now?language=${language}&code=${encodeURIComponent(code)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-medium mb-4">Code</h2>
      <div className="flex gap-4 mb-4">
        {codeCpp && (
          <button
            onClick={() => setActiveTab("cpp")}
            className={`tab-button py-2 px-6 rounded-lg font-medium text-lg ${
              activeTab === "cpp" ? "bg-slate-600" : ""
            }`}
          >
            C++
          </button>
        )}
        {codePy && (
          <button
            onClick={() => setActiveTab("python")}
            className={`tab-button py-2 px-6 rounded-lg font-medium text-lg ${
              activeTab === "python" ? "bg-slate-600" : ""
            }`}
          >
            Python
          </button>
        )}
        {/* Add Try Now button */}
        <button
          onClick={() => openTryNowTab(activeTab)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Try Now
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "cpp" && codeCpp && (
          <SyntaxHighlighter language="cpp" style={nord}>
            {codeCpp}
          </SyntaxHighlighter>
        )}
        {activeTab === "python" && codePy && (
          <SyntaxHighlighter language="python" style={nord}>
            {codePy}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default CodeRenderer;
