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

    // Function to transform relative image paths to absolute paths
    const transformImagePaths = (content: string, blogId: string): string => {
        // Replace relative image paths like ./img/image.png with absolute paths
        // Handle both ./img/image.png and img/image.png formats
        return content
            .replace(
                /!\[([^\]]*)\]\(\.\/img\/([^)]+)\)/g,
                `![$1](/blogs/${blogId}/img/$2)`
            )
            .replace(
                /!\[([^\]]*)\]\(img\/([^)]+)\)/g,
                `![$1](/blogs/${blogId}/img/$2)`
            );
    };

    useEffect(() => {
        if (!id) {
            setErrorMessage('No blog id provided.');
            setMarkdownContent('');
            return;
        }

        let isCancelled = false;
        setErrorMessage('');

        fetch(`/blogfiles/${id}/index.md`)
            .then(async (response) => {
                if (!isCancelled) {
                    if (!response.ok) {
                        throw new Error(`Failed to load markdown: ${response.status}`);
                    }
                    const text = await response.text();
                    if (!isCancelled) {
                        const transformedContent = transformImagePaths(text, id);
                        setMarkdownContent(transformedContent);
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

    // To ensure all clicks in the blog lead to a new tab opening
    const handleClick = (e: any) => {
        const link = e.target.closest("a");
        if (link && e.currentTarget.contains(link)) {
          window.open(link.href, "_blank", "noopener,noreferrer");
          e.preventDefault();
        }
      };

    return (
      <div className="blog-container" onClick={handleClick}>
        <div className="blog-title">{convertIDToTitle(id)}</div>
        {errorMessage && (
            <div style={{ color: '#ff6b6b', marginTop: '1rem' }}>{errorMessage}</div>
        )}
        {!errorMessage && (
            <div className={`blog-markdown`} style={{ textAlign: 'left' }}>
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
