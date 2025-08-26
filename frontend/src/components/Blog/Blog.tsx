import React, { useEffect, useMemo, useState } from 'react';
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack will provide string URLs for these imports
import initialCommitUrl from './blogs/initial_commit.md';

const Blog: React.FC = () => {
    const { id } = useParams();

    const idToMarkdownUrl = useMemo<Record<string, string>>(() => ({
        initial_commit: initialCommitUrl,
    }), []);

    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!id) {
            setErrorMessage('No blog id provided.');
            setMarkdownContent('');
            return;
        }

        const urlForId = idToMarkdownUrl[id];

        if (!urlForId) {
            setErrorMessage(`Blog not found for id: ${id}`);
            setMarkdownContent('');
            return;
        }

        let isCancelled = false;
        setErrorMessage('');

        fetch(urlForId)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load markdown: ${response.status}`);
                }
                const text = await response.text();
                if (!isCancelled) {
                    setMarkdownContent(text);
                }
            })
            .catch((error) => {
                if (!isCancelled) {
                    setErrorMessage(error.message || 'Failed to load blog.');
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [id, idToMarkdownUrl]);

    return (
      <div className="blog-container">
        <div className="blog-title">{id}</div>
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
