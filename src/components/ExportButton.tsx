import useClipboard from "react-use-clipboard"
import {SidebarItemExport} from "layout/SidebarItemExport";
import {generateCode} from "../util/generate-code";
import {FaClipboard, FaClipboardCheck} from "react-icons/fa";
import React from "react";

type ExportButtonProps = {
  id: string,
  typeName: string
}

export const ExportButton = (props: ExportButtonProps) => {
  const {id, typeName} = props
  const code = generateCode(id, typeName)
  const [isCopied, setCopied] = useClipboard(code, {
    successDuration: 1000
  });

  return(
    <SidebarItemExport onClick={setCopied} title={"Copy snippet to clipboard"} active={isCopied}>
      {isCopied ? <FaClipboardCheck/> : <FaClipboard/>}
    </SidebarItemExport>
  )
}