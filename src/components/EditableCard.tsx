"use client";

import React from "react";
import { useEditMode } from "./EditModeContext";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  style,
  placeholder,
  multiline = false,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = React.useState(false);

  if (!isEditMode && !isEditing) {
    return (
      <div
        className={className}
        style={style}
        onClick={() => setIsEditing(true)}
      >
        {value || placeholder}
      </div>
    );
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={className}
        style={style}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setIsEditing(false)}
      className={className}
      style={style}
      placeholder={placeholder}
      autoFocus
    />
  );
}

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  itemClassName?: string;
  markerColor?: string;
}

export function EditableList({
  items,
  onChange,
  itemClassName,
  markerColor,
}: EditableListProps) {
  const { isEditMode } = useEditMode();

  const handleItemChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  const handleAddItem = () => {
    onChange([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className={markerColor || "text-gray-500"}>•</span>
          {isEditMode ? (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className={`flex-1 ${itemClassName || ""}`}
              />
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          ) : (
            <span className={itemClassName}>{item}</span>
          )}
        </li>
      ))}
      {isEditMode && (
        <li>
          <button
            onClick={handleAddItem}
            className="text-blue-500 text-sm"
          >
            + Add item
          </button>
        </li>
      )}
    </ul>
  );
}

interface EditableKeyValueProps {
  data: Array<{ label: string; value: string }>;
  onChange: (data: Array<{ label: string; value: string }>) => void;
}

export function EditableKeyValue({
  data,
  onChange,
}: EditableKeyValueProps) {
  const { isEditMode } = useEditMode();

  const handleLabelChange = (index: number, newLabel: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], label: newLabel };
    onChange(newData);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], value: newValue };
    onChange(newData);
  };

  const handleAddItem = () => {
    onChange([...data, { label: "", value: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          {isEditMode ? (
            <>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Label"
              />
              <span className="text-gray-500">:</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Value"
              />
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </>
          ) : (
            <>
              <span className="font-medium text-gray-700">{item.label}:</span>
              <span className="text-gray-900">{item.value}</span>
            </>
          )}
        </div>
      ))}
      {isEditMode && (
        <button
          onClick={handleAddItem}
          className="text-blue-500 text-sm hover:text-blue-700"
        >
          + Add item
        </button>
      )}
    </div>
  );
}

