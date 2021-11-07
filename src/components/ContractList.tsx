import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
import {IoMdAddCircleOutline} from "react-icons/io";
import {FaTimes} from "react-icons/fa";
import {TabSection} from "layout/TabSection";
import {TabItems} from "layout/TabItems";
import {TabItem} from "layout/TabItem";
import {TabItemInsert} from "layout/TabItemInsert";
import {TabItemDelete} from "layout/TabItemDelete";
import useKeyPress from "../hooks/useKeyPress";
import { ExportButton } from "components/ExportButton";
import { getParams } from "../util/url";
import { useProject } from "providers/Project/projectHooks";
import { EntityType } from "providers/Project";
import { useLocation } from "@reach/router";

type ContractListProps = {
  active: number | null;
  title: string;
  items: any[];
  onSelect: (e: SyntheticEvent, id: string) => void;
  onUpdate: any;
  onInsert: (e: SyntheticEvent) => void;
  onDelete: any;
};


const ContractList: React.FC<ContractListProps> = ({
  items,
  onSelect,
  onInsert,
  onDelete
}) => {
  const { project, active } = useProject()
  const isEditing = useRef<HTMLInputElement>();
  const [editing, setEditing] = useState([]);
  const enterPressed = useKeyPress("Enter");
  const escapePressed = useKeyPress("Escape");

  useEffect(() => {
    setEditing([]);
  }, [items, active]);

  useEffect(() => {
    if (enterPressed || escapePressed) {
      setEditing([]);
      isEditing.current?.blur();
    }
  }, [enterPressed, escapePressed]);

  const location = useLocation();
  const params = getParams(location.search)

  var itemType = EntityType.Account;
  params.id = params.contractId;
  if(!params.id && active.contractIndex != null) params.id = project.contracts[active.contractIndex].id;

  return (
    <TabSection>
        {onInsert && (
          <TabItemInsert onClick={(e: React.SyntheticEvent) => onInsert(e)}>
            <IoMdAddCircleOutline size="20px" />
          </TabItemInsert>
        )}
      <TabItems>
        {items.map((item, i) => {
          const isActive = active.type === itemType && item.id === params.id
          return (
            <TabItem
              title={item.title}
              key={item.id}
              active={isActive}
              onClick={(e: React.SyntheticEvent<Element, Event>) =>
                onSelect(e, item.id)
              }
            >
              {item.title}

              {isActive && items.length > 99 && (
                <>
                  <ExportButton id={item.id} typeName={item.__typename}/>
                </>
              )}

              {!editing.includes(i) && isActive && items.length > 1 && (
                <TabItemDelete
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}>
                  <FaTimes />
                </TabItemDelete>
              )}
            </TabItem>
          );
        })}
      </TabItems>
    </TabSection>
  );
};

export default ContractList;
