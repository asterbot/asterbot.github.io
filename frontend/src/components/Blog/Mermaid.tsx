import React, { useEffect, useId, useState } from 'react';

// Lazily load mermaid so only posts with diagrams pay for the bundle
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;
function loadMermaid() {
    if (!mermaidPromise) {
        mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                fontFamily: 'var(--mono)',
                themeVariables: {
                    background: '#17171d',
                    primaryColor: '#1d1d24',
                    primaryBorderColor: '#bdc2ff',
                    primaryTextColor: '#e4e1e9',
                    lineColor: '#91909a',
                    clusterBkg: '#0e0e12',
                    clusterBorder: '#46464f',
                },
            });
            return mermaid;
        });
    }
    return mermaidPromise;
}

const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
    const id = 'mermaid-' + useId().replace(/:/g, '');
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let isCancelled = false;
        loadMermaid()
            .then((mermaid) => mermaid.render(id, chart))
            .then(({ svg }) => { if (!isCancelled) setSvg(svg); })
            .catch((e) => { if (!isCancelled) setError(String(e?.message ?? e)); });
        return () => { isCancelled = true; };
    }, [id, chart]);

    if (error) return <pre className="out-error">{error}</pre>;
    return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
