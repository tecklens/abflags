import {FeatureType} from "@abflags/shared";
import {Icon24Hours, IconArrowRampRight, IconHandStop, IconPercentage, IconRecharging} from "@tabler/icons-react";
import React from "react";

export const FEATURE_TYPES = [
  {
    id: FeatureType.RELEASE,
    label: 'Release Toggle',
    icon: <IconArrowRampRight size={18}/>
  },
  {
    id: FeatureType.EXPERIMENT,
    label: 'Experiment',
    icon: <IconPercentage size={18}/>
  },
  {
    id: FeatureType.OPERATIONAL,
    label: 'Operational',
    icon: <IconRecharging size={18}/>
  },
  {
    id: FeatureType.KILLSWITCH,
    label: 'Kill Switch',
    icon: <Icon24Hours size={18}/>
  },
  {
    id: FeatureType.PERMISSION,
    label: 'Permission',
    icon: <IconHandStop size={18}/>
  }
]
