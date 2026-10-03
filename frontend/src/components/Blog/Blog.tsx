import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/base16/material-darker.css';
import './Blog.css';
import { postById, branchOf } from './data/gitGraph';


function convertIDToTitle(id: string | undefined){
    if (!id) return id;
    // Prefer the title from posts.ts; fall back to prettifying the id
    const post = postById(id);
    if (post) return post.title;
    return id.split("_").map((s) => {return s.charAt(0).toUpperCase() + s.slice(1)}).join(" ");
}

const Blog: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = postById(id);
    const branch = post && branchOf(post);

    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Function to transform relative image paths to absolute paths
    const transformImagePaths = (content: string, blogId: string): string => {
        // Replace relative image paths like ./img/image.png with absolute paths
        // Handle both ./img/image.png and img/image.png formats
        return content
            .replace(
                /!\[([^\]]*)\]\(\.\/img\/([^)]+)\)/g,
                `![$1](/blogfiles/${blogId}/img/$2)`
            )
            .replace(
                /!\[([^\]]*)\]\(img\/([^)]+)\)/g,
                `![$1](/blogfiles/${blogId}/img/$2)`
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
      <div>
        <div className="section-rule"><span className="section-path blogs-accent">~/blogs/{id}</span></div>
        <h1 className="section-title blogs-accent">{convertIDToTitle(id)}</h1>
        <div className="section-hint">
          cat index.md
          {branch && <> &middot; on branch <span style={{ color: branch.color }}>{branch.name}</span></>}
          {' '}&middot; <button type="button" className="link-button hint-link" onClick={() => navigate('/blogs')}>cd ..</button>
        </div>

        {errorMessage && (
            <div className="out-error">{errorMessage}</div>
        )}
        {!errorMessage && (
            <div className="blog-markdown" onClick={handleClick}>
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
