import React, { SyntheticEvent, useState, useEffect, useRef } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPen, FaTimes, FaClipboard } from "react-icons/fa";
import { SidebarSection } from "layout/SidebarSection";
import { SidebarHeader } from "layout/SidebarHeader";
import { SidebarItems } from "layout/SidebarItems";
import { SidebarItem } from "layout/SidebarItem";
import { SidebarItemInsert } from "layout/SidebarItemInsert";
import { SidebarItemInput } from "layout/SidebarItemInput";
import { SidebarItemEdit } from "layout/SidebarItemEdit";
import { SidebarItemDelete } from "layout/SidebarItemDelete";
import useKeyPress from "../hooks/useKeyPress";
import {SidebarItemExport} from "layout/SidebarItemExport";

type MenuListProps = {
  active: number | null;
  title: string;
  values: any[];
  onSelect: (e: SyntheticEvent, index: number) => void;
  onUpdate: any;
  onInsert: (e: SyntheticEvent) => void;
  onDelete: any;
};

const NAME_MAX_CHARS = 50;

const MenuList: React.FC<MenuListProps> = ({
  active,
  title,
  values,
  onSelect,
  onUpdate,
  onInsert,
  onDelete
}) => {
  const isEditing = useRef<HTMLInputElement>();
  const [editing, setEditing] = useState([]);
  const enterPressed = useKeyPress("Enter");
  const escapePressed = useKeyPress("Escape");

  const toggleEditing = (i: number, newTitle: string) => {
    if (editing.includes(i)) {
      let _editing = [...editing];
      _editing.splice(_editing.indexOf(i), 1);
      setEditing(_editing);
      onUpdate(values[i].id, values[i].script, newTitle);
      return;
    }
    return setEditing([...editing, i]);
  };

  const copyScript = async (menuItem:any) => {
    const API = "http://localhost:8080"
    const projectid = "6e11c248-95e8-426c-b37e-9e5e38d8b764"
    const scriptType = menuItem.__typename.toLowerCase().replace('template','')
    const src = `${API}/embed/${projectid}/${scriptType}/${menuItem.id}`
    const snippetCode = `<script src="${src}"></script>`

    try {
      await navigator.clipboard.writeText(snippetCode);
      // TODO: show "good" toast
    }
    catch (err) {
      // TODO: show "bad" toast
    }
  }

  useEffect(() => {
    setEditing([]);
  }, [values, active]);

  useEffect(() => {
    if (enterPressed || escapePressed) {
      setEditing([]);
      isEditing.current?.blur();
    }
  }, [enterPressed, escapePressed]);

  const setEditingRef = (element: HTMLInputElement | undefined) => {
    isEditing.current = element;
    element?.focus();
    element?.select()
  };

  return (
    <SidebarSection>
      <SidebarHeader>
        {title}
        {onInsert && (
          <SidebarItemInsert onClick={(e: React.SyntheticEvent) => onInsert(e)}>
            <IoMdAddCircleOutline size="20px" />
          </SidebarItemInsert>
        )}
      </SidebarHeader>
      <SidebarItems>
        {values.map((value, i) => {
          return (
            <SidebarItem
              key={value.id}
              active={active === i}
              onClick={(e: React.SyntheticEvent<Element, Event>) =>
                onSelect(e, i)
              }
            >
              {/* NOTE: Optimize this to a controlled input! */}
              <SidebarItemInput
                ref={editing.includes(i) ? setEditingRef : () => {}}
                type="text"
                onBlur={(e: any) => {
                  if (e.target.value.length === 0) {
                    isEditing.current.value = value.title;
                  } else {
                    toggleEditing(i, e.target.value);
                  }
                }}
                defaultValue={value.title}
                readonly={!editing.includes(i)}
                onChange={e => {
                  if (e.target.value.length > NAME_MAX_CHARS) {
                    isEditing.current.value = e.target.value.substr(
                      0,
                      NAME_MAX_CHARS - 1
                    );
                  }
                }}
              />
              {active === i && (
                <>
                  <SidebarItemEdit onClick={() => toggleEditing(i, value.title)}>
                    <FaPen />
                  </SidebarItemEdit>

                  <SidebarItemExport onClick={()=> copyScript(value)} title={"Copy snippet to clipboard"}>
                    <FaClipboard/>
                  </SidebarItemExport>
                </>
              )}

              {!editing.includes(i) && active === i && values.length > 1 && (
                <SidebarItemDelete
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDelete(value.id);
                  }}>
                  <FaTimes />
                </SidebarItemDelete>
              )}
            </SidebarItem>
          );
        })}
      </SidebarItems>
    </SidebarSection>
  );
};

export default MenuList;
