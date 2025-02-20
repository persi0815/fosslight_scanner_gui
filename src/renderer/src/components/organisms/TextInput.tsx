import { FC, ReactNode, useEffect, useState } from 'react';
import Text from '../atoms/text/Text';
import { BrowseIcon } from '../atoms/SVGIcons';
import Dropdown, { IDropdownOption } from '../molecules/dropdown/Dropdown';
import Input from '../atoms/input/Input';
import IconButton from '../atoms/button/IconButton';

export interface ITextInputOption extends IDropdownOption {
  type: 'text' | 'dir' | 'file';
  placeholder?: string;
}

interface ITextInputProps {
  label?: string;
  required?: boolean;
  showDropdown?: boolean;
  showInput?: boolean;
  fullWidth?: boolean;
  options: ITextInputOption[];
  suffix?: ReactNode;
  value?: string;
  onChange?: (value?: string, type?: ITextInputOption['type']) => void;
}

const TextInput: FC<ITextInputProps> = ({
  label,
  required = false,
  showDropdown = true,
  showInput = true,
  fullWidth = false,
  options,
  suffix,
  value: inputValue,
  onChange
}) => {
  const [selectedOption, setSelectedOption] = useState<ITextInputOption>(options[0]);
  const [value, setValue] = useState<string>(inputValue ?? '');

  const handleDropdownChange = (value: string) => {
    setSelectedOption(options.find((option) => option.value === value) || options[0]);
    setValue('');
    onChange?.();
  };

  const handleInputChange = (value: string) => {
    setValue(value);
    onChange?.(value, selectedOption.type);
  };

  const handleFileUploadClick = () => {
    if (selectedOption.type === 'dir') {
      window.nativeApi.openDirSelector((dirPath) => {
        setValue(dirPath);
        onChange?.(dirPath, selectedOption.type);
      });
    } else {
      window.nativeApi.openFileSelector((filePath) => {
        setValue(filePath);
        onChange?.(filePath, selectedOption.type);
      });
    }
  };

  useEffect(() => {
    setValue(inputValue ?? '');
  }, [inputValue]);

  return options.length === 0 ? null : (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <div className="flex gap-[2px] bg-transparent">
          <Text type="p200-m" color="PaleGray-900">
            {label}
          </Text>
          {required && (
            <Text type="p200-m" color="LGRed-600">
              *
            </Text>
          )}
        </div>
      )}
      <div className="flex w-full gap-2">
        {showInput && (
          <div
            className={`flex h-[36px] w-[280px] min-w-[280px] items-center rounded-lg border border-PaleGray-300 bg-white px-1 ${fullWidth && 'w-full'}`}
          >
            {showDropdown && (
              <>
                <div className="mr-2">
                  <Dropdown
                    options={options}
                    onChange={handleDropdownChange}
                    value={selectedOption.value}
                  />
                </div>
                <div className="h-[16px] w-[1px] bg-PaleGray-300" />
              </>
            )}
            {(selectedOption.type === 'dir' || selectedOption.type === 'file') && (
              <>
                <div className="flex w-full items-center overflow-hidden px-[6px]">
                  <Text type="p100-r" color={`PaleGray-${value ? 1000 : 500}`} className="truncate">
                    {value || selectedOption.placeholder}
                  </Text>
                </div>
                <IconButton onClick={handleFileUploadClick}>
                  <BrowseIcon />
                </IconButton>
              </>
            )}
            {selectedOption.type === 'text' && (
              <div className="flex w-full items-center px-[6px]">
                <Input
                  placeholder={selectedOption.placeholder}
                  value={value}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        )}
        {suffix}
      </div>
    </div>
  );
};

export default TextInput;
