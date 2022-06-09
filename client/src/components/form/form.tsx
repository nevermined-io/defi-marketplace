import React, { HTMLAttributes } from 'react'
import {BEM} from 'ui'
import styles from './form.module.scss'

const b = BEM('form', styles)

export const Form = (props: HTMLAttributes<any>) => {
    return (
        <div className={b('container')}>
            {props.children}
        </div>
    )
}