import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlgorithmDetails } from "../utils/githubApi";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeRenderer from "./CodeRenderer"; 

const difficultyColors = {
  easy: "green-600",
  medium: "orange-500",
  hard: "red-600",
};

const AlgorithmDetails = () => {
  const { category, algorithm } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAlgorithmDetails = async () => {
      try {
        const data = await fetchAlgorithmDetails(category, algorithm);
        setDetails(data);
      } catch (err) {
        setError("Error fetching algorithm details.");
      } finally {
        setLoading(false);
      }
    };

    getAlgorithmDetails();
  }, [category, algorithm]);

  if (loading) return <div className="max-w-screen-xl mx-auto px-4"><Loader /></div>;
  if (error) return <div className="text-center text-red-500 my-8">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="mx-auto bg-slate-700 px-4 py-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {/* Difficulty */}
            {details.metadata.difficulty && (
              <span
                className={`px-2 py-1 text-white rounded-full text-xs bg-${difficultyColors[details.metadata.difficulty.toLowerCase()]}`}
              >
                {details.metadata.difficulty}
              </span>
            )}
            {/* Tags */}
            {details.metadata.tags &&
              details.metadata.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <ReactMarkdown
            className="prose prose-invert max-w-none"
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter style={nord} language={match[1]} {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-slate-700 text-slate-300 px-1 py-0.5 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {details.description}
          </ReactMarkdown>
        </div>

        {/* Code Section */}
        <div className="mt-16">
          <CodeRenderer
            codeCpp={details.codeCpp}
            codePy={details.codePy}
            description={details.description}
          />
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetails;
