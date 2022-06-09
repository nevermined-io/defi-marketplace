import React, { InputHTMLAttributes } from 'react'
import { BEM, UiButton } from 'ui'
import styles from './form.module.scss'
const b = BEM('form', styles)

interface FormAddItemProps {
    label: string
}

export const FormAddItem = (props: FormAddItemProps & InputHTMLAttributes<any>) => {
    const {label, value, type, placeholder, onChange, onClick, disabled, className } = props;

    return (
        <div className={className}>
            <label>{label}</label>
            <div className={b('form-add-item-container')}>
                <input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={onChange}/>
                <UiButton className={b('form-add-item-container',['add-button'])} square={true} onClick={onClick}>+</UiButton>
            </div>
        </div>
    )
}