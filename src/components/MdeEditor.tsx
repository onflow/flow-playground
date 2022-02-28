import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "unreset-css/dist/unreset.min.css"; // restore browser default element styles
import "../styles/markdown.css"

export const MdeEditor: React.FC<{
  value: string;
  onChange: (v: string) => void;
  overflow: boolean
}> = ({ value, onChange, overflow }) => {

  const className = overflow ? "unreset ease-md-red-border" : "unreset"

  return (
    <SimpleMDE
      className={className}
      value={value}
      onChange={v => onChange(v)}
    />
  )
}
