import React, {SyntheticEvent} from "react";
import {IoMdAddCircleOutline} from "react-icons/io";
import {FaTimes} from "react-icons/fa";
import {TabSection} from "layout/TabSection";
import {TabItems} from "layout/TabItems";
import {TabItem} from "layout/TabItem";
import {TabItemInsert} from "layout/TabItemInsert";
import {TabItemDelete} from "layout/TabItemDelete";
import { getParams } from "../util/url";
import { useProject } from "providers/Project/projectHooks";
import { EntityType } from "providers/Project";
import { useLocation } from "@reach/router";
import {ExportButton} from "components/ExportButton";

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

  const location = useLocation();
  const params = getParams(location.search)

  var itemType = EntityType.Account;
  if(!params.contractId && active.contractIndex != null) params.contractId = project.contracts[active.contractIndex].id;

  return (
    <TabSection>
        {onInsert && (
          <TabItemInsert onClick={(e: React.SyntheticEvent) => onInsert(e)}>
            <IoMdAddCircleOutline size="20px" />
          </TabItemInsert>
        )}
      <TabItems>
        {items.map(item => {
          const isActive = active.type === itemType && item.id === params.contractId
          const typeName = item.__typename
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

              {isActive && <ExportButton id={item.id} typeName={typeName}/>}

              {isActive && items.length > 1 && (
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
