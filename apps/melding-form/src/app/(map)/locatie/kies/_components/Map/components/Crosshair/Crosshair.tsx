import { HTMLAttributes } from 'react'

import styles from './Crosshair.module.css'

export const Crosshair = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={styles.crosshair}>
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="none">
      <path
        fill="#000"
        d="M20.588 45.917v-4.32c-8.426-1.083-15.102-7.758-16.184-16.185H.084v-4.166H4.33c.81-8.735 7.613-15.732 16.257-16.842V.084h4.167V4.33c8.955.831 16.083 7.96 16.914 16.915h4.248v4.166h-4.32c-1.11 8.645-8.108 15.447-16.842 16.257v4.248h-4.167ZM23 37.583c8.054 0 14.584-6.529 14.584-14.583S31.053 8.417 23 8.417C14.946 8.417 8.417 14.946 8.417 23S14.946 37.584 23 37.584Z"
      />
    </svg>
  </div>
)
