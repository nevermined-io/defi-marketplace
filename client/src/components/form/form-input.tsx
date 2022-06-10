import React, { InputHTMLAttributes } from 'react'
import { UiText } from 'ui'

interface FormInputProps {
    label: string,
    inputError?: string
}

export const FormInput = (props: FormInputProps & InputHTMLAttributes<any>) => {
    const {label, inputError, value, type, placeholder, onChange, disabled, className } = props;

    return (
        <div className={className}>
            <label>{label}</label>
            <input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={onChange}/>
            {inputError && 
                <UiText variants={['error']}>{inputError}</UiText>
            }
        </div>
    )
}