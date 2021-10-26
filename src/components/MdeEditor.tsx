import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "unreset-css/dist/unreset.min.css"; // restore browser default element styles


export const MdeEditor: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {

  return (
    <SimpleMDE
      className="unreset"
      value={value}
      onChange={v => onChange(v)}
    />
  )
}