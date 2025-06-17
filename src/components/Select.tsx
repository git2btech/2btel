import { useState } from "react";
import { Select as GluestackSelect, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@gluestack-ui/themed";
import { ChevronDownIcon } from "lucide-react-native";

export type DataSelect = { 
  value: string, 
  label: string
};

type Props = {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  data: DataSelect[];
};

export function Select({ onValueChange, defaultValue, data }: Props) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <GluestackSelect defaultValue={selectedValue} onValueChange={handleChange}>
      <SelectTrigger w="$full" backgroundColor="$primary000" size="md" height="$14" mb="$4">
        <SelectInput placeholder="Selecione uma opção" flex={1}/>
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem label="Selecione..." value="" />
          {data && 
            data.map((item: DataSelect) => (
              <SelectItem label={item.label} value={item.value} key={item.value}/>
            ))
          }
        </SelectContent>
      </SelectPortal>
    </GluestackSelect>
  );
}