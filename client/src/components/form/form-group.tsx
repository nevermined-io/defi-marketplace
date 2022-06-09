import React, { HtmlHTMLAttributes } from 'react'
import { BEM } from 'ui'
import styles from './form.module.scss'

const b = BEM('form', styles)

export enum Orientation {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

interface FormGroupProps {
    orientation: Orientation
}

export const FormGroup = (props: FormGroupProps & HtmlHTMLAttributes<any>) => {
    const { orientation, className } = props

    return (
        <div className={className}>
            <div className={b('form-group', [orientation])}>
                {props.children}
            </div>
        </div>
    )
}