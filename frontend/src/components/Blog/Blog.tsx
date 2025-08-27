import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import './Blog.css';


function convertIDToTitle(id: string | undefined){
    if (!id) return id;
    return id.split("_").map((s) => {return s.charAt(0).toUpperCase() + s.slice(1)}).join(" ");
}

const Blog: React.FC = () => {
    const { id } = useParams();

    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!id) {
            setErrorMessage('No blog id provided.');
            setMarkdownContent('');
            return;
        }

        let isCancelled = false;
        setErrorMessage('');

        // Dynamically import the markdown file based on the id
        import(`./blogs/${id}.md`)
            .then((module) => {
                if (!isCancelled) {
                    // Fetch the content from the imported URL
                    return fetch(module.default);
                }
            })
            .then(async (response) => {
                if (!isCancelled && response) {
                    if (!response.ok) {
                        throw new Error(`Failed to load markdown: ${response.status}`);
                    }
                    const text = await response.text();
                    if (!isCancelled) {
                        setMarkdownContent(text);
                    }
                }
            })
            .catch((_error) => {
                if (!isCancelled) {
                    setErrorMessage(`Blog not found for id: ${id}`);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [id]);

    return (
      <div className="blog-container">
        <div className="blog-title">{convertIDToTitle(id)}</div>
        {errorMessage && (
            <div style={{ color: '#ff6b6b', marginTop: '1rem' }}>{errorMessage}</div>
        )}
        {!errorMessage && (
            <div style={{ textAlign: 'left' }}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        )}
      </div>
    )
}
export default Blog;
