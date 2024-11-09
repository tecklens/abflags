import React, {useEffect, useState} from "react";
import {useAbflags} from "./ab-provider";
interface Props {
  feature: string;
  children: React.ReactNode | React.ReactNode[];
  containerClassName?: string;
}

export default function AbIf({feature, children, containerClassName}: Props) {
  const [active, setActive] = useState(false)
  const {client} = useAbflags()

  useEffect(() => {
    if (client)
      setActive(client.isEnabled(feature))
  }, [client, feature])

  const aVersion = Array.isArray(children) ? children[0] : children
  const bVersion = Array.isArray(children) && children.length > 1 ? children[1] : undefined

  return (
    <div className={`${containerClassName}`}>
      {active || !bVersion ? aVersion : bVersion}
    </div>
  )
}
