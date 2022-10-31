import React from 'react';
import { createPortal } from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { ChildProps } from 'src/types';

interface TooltipProps extends ChildProps {
  label: string;
  disabled?: boolean;
  delayShow?: number;
}

const Tooltip = ({ label, disabled, delayShow, children }: TooltipProps) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      trigger: 'hover',
      delayShow: delayShow || 0,
    },
    {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            padding: 16,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 20],
          },
        },
      ],
    },
  );

  if (disabled) return <>{children}</>;

  return (
    <>
      <div ref={setTriggerRef}>{children}</div>
      {visible &&
        createPortal(
          <div
            ref={setTooltipRef}
            {...getTooltipProps({ className: 'tooltip-container' })}
          >
            {label}
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
