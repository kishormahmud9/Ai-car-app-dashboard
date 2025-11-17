import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentDecrease,
  IndentIncrease,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function TextToolbar() {
  const [fontSize, setFontSize] = useState("12");
  const [formatting, setFormatting] = useState([]);
  const [align, setAlign] = useState("left");

  return (
    <div className=" flex items-center gap-2  bg-white p-2">

      <div className="flex items-center">
        <Select value={fontSize} onValueChange={setFontSize}>
          <SelectTrigger className="w-20 h-[26px] font-noto border border-[#CCCCCC] text-[12px] ">
            <SelectValue  placeholder="12" />
          </SelectTrigger>
          <SelectContent className="font-noto">
            {["10", "11", "12", "13", "14", "16", "18", "20", "24"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="mx-1 h-[26px]" />

      
      <ToggleGroup
        type="multiple"
        value={formatting}
        onValueChange={(v) => setFormatting(v)}
        className=" border border-[#CCCCCC] bg-[#EEEEEE] p-1"
      >
        <ToggleGroupItem
          value="bold"
          className="h-[26px] w-10"
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          className="h-[26px] w-10"
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          className="h-[26px] w-10 rounded"
          aria-label="Toggle underline"
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="mx-1 h-[26px]" />

      {/* Alignment */}
      <ToggleGroup
        type="single"
        value={align}
        onValueChange={(v) => v && setAlign(v)}
        className="border border-[#CCCCCC] bg-[#EEEEEE] p-1"
      >
        <ToggleGroupItem value="left" className="h-[26px] w-10 ">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" className="h-[26px] w-10 ">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" className="h-[26px] w-10 ">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" className="h-[26px] w-10 ">
          <AlignJustify className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="mx-1 h-[26px]" />

      {/* Indent controls */}
      <div className="flex items-center gap-1 rounded border border-[#CCCCCC] bg-[#EEEEEE] p-1">
        <Button variant="ghost" size="icon" className="h-[26px] w-10 rounded">
          <IndentDecrease className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-[26px] w-10 rounded">
          <IndentIncrease className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default TextToolbar;