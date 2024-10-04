import {ColorPicker, IColor, useColor} from "react-color-palette";
import "react-color-palette/css";
import React, {useEffect} from "react";
import {Input} from "@client/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@client/components/ui/popover";

export default function CustomColorPicker({hexColor, onChange}: { hexColor: string, onChange: (hex: string) => void }) {
  const [color, setColor] = useColor(hexColor ?? "#123123");

  const onChangeComplete = (color: IColor) => {
    onChange(color.hex)
  };

  useEffect(() => {
    setColor(prevState => ({
      ...prevState,
      hex: hexColor
    }))
  }, [hexColor])

  return <Popover>
    <PopoverTrigger asChild>
      <div className={'w-full flex space-x-2'}>
        <Input value={hexColor} className={''}/>
        <div style={{backgroundColor: hexColor ?? '#fff'}} className={'w-[100px] rounded-lg'}>

        </div>
      </div>
    </PopoverTrigger>
    <PopoverContent className="p-0">
      <ColorPicker color={color} onChange={setColor} onChangeComplete={onChangeComplete}/>
    </PopoverContent>
  </Popover>
}
