import { Dropdown } from "../ui/Dropdown";
import type { MediaFormat } from "../../types/media";

interface FormatSelectorProps {
  formats: MediaFormat[];
  selectedFormatId: string | null;
  onSelect: (formatId: string) => void;
}

export const FormatSelector = ({
  formats,
  selectedFormatId,
  onSelect,
}: FormatSelectorProps) => {
  const options = formats.map((f) => ({
    value: f.id,
    label: f.label,
  }));

  return (
    <Dropdown
      value={selectedFormatId ?? ""}
      onValueChange={onSelect}
      options={options}
      placeholder="Select format..."
    />
  );
};
