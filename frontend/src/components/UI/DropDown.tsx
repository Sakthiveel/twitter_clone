import React from "react";
export interface DropDownItem<T = string> {
  displayText: string;
  value?: T;
  onClickHandler(value: T | undefined): void;
}
export interface DropDownIconProps {
  isDropdownVisible?: boolean;
  onClickHandler: () => void;
}
export default function Dropdown<T>(props: {
  dropDownItems: Array<DropDownItem<T>>;
  Ele: React.FC<DropDownIconProps>;
}) {
  const dropDownRef = React.useRef<HTMLDivElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] =
    React.useState<boolean>(true);

  const toggleDropDown = () => {
    setIsDropdownVisible((prevSt) => !prevSt);
  };
  const { dropDownItems, Ele } = props;
  React.useEffect(() => {
    const body = document.body as HTMLBodyElement;

    const handleClickOutside = (ev: MouseEvent) => {
      // Check if the click target is outside the dropdown and the dropdown is visible
      console.log({
        target: ev.target,
        dropDownRef: dropDownRef.current,
        bool: dropDownRef.current?.contains(ev.target as Node),
      });
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(ev.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      // Attach event listener only when the dropdown is visible
      body.addEventListener("click", handleClickOutside);
    }

    return () => {
      // Clean up: Remove the event listener if dropdown is closed or on unmount
      body.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);
  console.log({ isDropdownVisible });
  return (
    <div className="relative" ref={dropDownRef}>
      <div>
        <Ele
          isDropdownVisible={isDropdownVisible}
          onClickHandler={toggleDropDown}
        />
      </div>
      <div
        className="absolute z-[999] top-8"
        style={{ display: isDropdownVisible ? "initial" : "none" }}
      >
        <div className="border border-grey shadow-sm  shadow-grey rounded-xl bg-defaultBC px-1 py-2">
          <div className="flex flex-col gap-2  w-[140px] h-fit max-h-[100px] overflow-y-auto ">
            {dropDownItems.map((item, index) => {
              const { displayText, onClickHandler, value } = item;
              return (
                <div
                  className="px-2 py-1 rounded hover:bg-grey delay-75 cursor-pointer text-sm overflow-hidden text-ellipsis text-nowrap whitespace-nowrap"
                  onClick={() => onClickHandler(value)}
                  key={`dropdown_${index}`}
                >
                  <div
                    style={{
                      overflow: "inherit",
                      textOverflow: "inherit",
                      whiteSpace: "inherit",
                    }}
                  >
                    {displayText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
