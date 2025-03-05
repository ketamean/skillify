import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

interface Option {
  label: string;
  children?: Option[];
}

interface DropdownProps {
  label: string;
  options: Option[];
  type: 1 | 2;
}

export function Dropdown({ label, options, type }: DropdownProps) {
  return type === 1 ? (
    <NestedDropdown label={label} options={options} />
  ) : (
    <HorizontalDropdown label={label} options={options} />
  );
}

const NestedDropdown: React.FC<{ label: string; options: Option[] }> = ({
  label,
  options,
}) => {
  const [active, setActive] = useState(false);
  const [subMenu, setSubMenu] = useState<number | null>(null);
  const [subSubMenu, setSubSubMenu] = useState<string | null>(null);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setSubMenu(null);
        setSubSubMenu(null);
      }}
    >
      <button className="bg-white text-black px-4 py-2 rounded-lg">
        {label}
      </button>
      {active && (
        <div className="absolute bg-white text-black border shadow-lg w-56 z-10">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer ${subMenu === index ? 'bg-pink-100 text-purple-600' : 'hover:bg-pink-100 hover:text-purple-600 bg-white text-black'}`}
              onMouseEnter={() => setSubMenu(index)}
            >
              <span>{option.label}</span>
              {option.children && <ChevronRight size={14} />}

              {subMenu === index && option.children && (
                <div className="absolute left-full top-0 bg-white border shadow-lg w-56 min-h-full flex flex-col">
                  {option.children.map((subOption, subIndex) => (
                    <div
                      key={subIndex}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer ${subSubMenu === `${index}-${subIndex}` ? 'bg-pink-100 text-purple-600' : 'hover:bg-pink-100 hover:text-purple-600 bg-white text-black'}`}
                      onMouseEnter={() => setSubSubMenu(`${index}-${subIndex}`)}
                    >
                      <span>{subOption.label}</span>
                      {subOption.children && <ChevronRight size={14} />}

                      {subSubMenu === `${index}-${subIndex}` && subOption.children && (
                        <div className="absolute left-full top-0 bg-white border shadow-lg w-56 min-h-full flex flex-col">
                          {subOption.children.map((subSubOption, subSubIndex) => (
                            <div
                              key={subSubIndex}
                              className="px-4 py-2 cursor-pointer bg-white text-black hover:bg-pink-100 hover:text-purple-600"
                            >
                              {subSubOption.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//Chinh cai top de keo len xuong (het cach r :)) )
const HorizontalDropdown: React.FC<{ label: string; options: Option[] }> = ({
  label,
  options,
}) => {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <button className="text-black px-4 py-2 rounded-lg flex items-center">
        {label}
      </button>
      {active && (
        <div className="fixed top-50 left-0 w-full bg-white shadow-md flex z-50">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex-1 bg-black text-white text-center py-2 cursor-pointer hover:text-purple-600"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
