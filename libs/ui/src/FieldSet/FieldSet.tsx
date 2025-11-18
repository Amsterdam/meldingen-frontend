/**
 * @license EUPL-1.2+
 * Copyright Gemeente Amsterdam
 */

import type { ForwardedRef } from 'react'

import { FieldSetProps } from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './FieldSet.module.css'

// The existing ADS FieldSet component cannot display a heading.
// This component serves as a temporary fix until the ADS FieldSet component is updated.

type Props = FieldSetProps & {
  hasHeading: boolean
}

export const FieldSet = forwardRef(
  (
    { children, className, hasHeading, hint = 'niet verplicht', invalid, legend, optional, ...restProps }: Props,
    ref: ForwardedRef<HTMLFieldSetElement>,
  ) => {
    const legendChildren = hasHeading ? (
      <h1 className={styles.h1}>
        {legend} {optional && <span className="ams-hint"> ({hint}) </span>}
      </h1>
    ) : (
      <>
        {legend} {optional && <span className="ams-hint"> ({hint}) </span>}
      </>
    )

    return (
      <fieldset
        {...restProps}
        className={clsx('ams-field-set', invalid && 'ams-field-set--invalid', className)}
        ref={ref}
      >
        <legend className="ams-field-set__legend">{legendChildren}</legend>
        {children}
      </fieldset>
    )
  },
)

FieldSet.displayName = 'FieldSet'
