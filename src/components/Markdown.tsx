import React from 'react';
import MarkdownPreview from "markdown-to-jsx";
import "unreset-css/dist/unreset.min.css"; // restore browser default element styles

export const Markdown: React.FC<{
  content: string;
}> = ({ content }) => {

  return (
    <MarkdownPreview
        className="unreset"
    >
            {content}
    </MarkdownPreview>
  )
}