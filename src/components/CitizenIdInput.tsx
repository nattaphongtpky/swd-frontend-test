"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "antd";
import styles from "@/style/CitizenIdInput.module.scss";

interface CitizenIdInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const SEGMENTS = [1, 4, 5, 2, 1];

const CitizenIdInput: React.FC<CitizenIdInputProps> = ({
  value = "",
  onChange,
}) => {
  const inputRefs = useRef<any[]>([]);

  const [segments, setSegments] = useState<string[]>(["", "", "", "", ""]);

  useEffect(() => {
    if (!value) {
      setSegments(["", "", "", "", ""]);
      return;
    }

    let currentIndex = 0;
    const newSegments = SEGMENTS.map((len) => {
      const part = value.substr(currentIndex, len);
      currentIndex += len;
      return part;
    });
    setSegments(newSegments);
  }, [value]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newSegments = [...segments];
    newSegments[index] = val;
    setSegments(newSegments);

    triggerChange(newSegments);

    if (val.length === SEGMENTS[index] && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && segments[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 13);

    if (!pasteData) return;

    let currentIndex = 0;
    const newSegments = SEGMENTS.map((len) => {
      const part = pasteData.substr(currentIndex, len);
      currentIndex += len;
      return part;
    });

    setSegments(newSegments);
    triggerChange(newSegments);
    const lastFilledIndex = newSegments.findIndex((s) => s === "") - 1;
    const targetFocus = lastFilledIndex >= 0 ? lastFilledIndex : 4;
    inputRefs.current[targetFocus]?.focus();
  };

  const triggerChange = (newSegments: string[]) => {
    if (onChange) {
      onChange(newSegments.join(""));
    }
  };

  return (
    <div className={styles.citizenInputWrapper}>
      {SEGMENTS.map((len, index) => (
        <React.Fragment key={index}>
          <Input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={segments[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength={len}
            className={styles.segmentInput}
            style={{
              width:
                len === 1
                  ? "100px"
                  : len === 2
                  ? "120px"
                  : len === 4
                  ? "150px"
                  : "150px",
            }}
          />
          {index < 4 && <span className={styles.separator}>-</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CitizenIdInput;
