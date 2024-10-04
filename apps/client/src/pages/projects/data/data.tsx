import { FeatureStatus } from '@abflags/shared'
import {ArrowDownIcon, ArrowRightIcon, ArrowUpIcon,} from '@radix-ui/react-icons'
import { IconDisabled, IconRadioactive } from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    label: 'Hoạt động',
    value: FeatureStatus.ACTIVE,
  },
  {
    label: 'Không Hoạt động',
    value: FeatureStatus.INACTIVE,
  }
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]
