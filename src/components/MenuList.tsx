import React, { SyntheticEvent, useState, useEffect, useRef } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPen, FaTimes } from "react-icons/fa";
import { SidebarSection } from "layout/SidebarSection";
import { SidebarHeader } from "layout/SidebarHeader";
import { SidebarItems } from "layout/SidebarItems";
import { SidebarItem } from "layout/SidebarItem";
import { SidebarItemInsert } from "layout/SidebarItemInsert";
import { SidebarItemInput } from "layout/SidebarItemInput";
import { SidebarItemEdit } from "layout/SidebarItemEdit";
import { SidebarItemDelete } from "layout/SidebarItemDelete";
import useKeyPress from "../hooks/useKeyPress";
import {ExportButton} from "components/ExportButton";

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

                  <ExportButton id={value.id} typeName={value.__typename}/>
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
