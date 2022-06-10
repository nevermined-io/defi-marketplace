import React, { InputHTMLAttributes } from 'react'
import { UiText } from 'ui'

interface FormTextareaProps {
    label: string,
    inputError?: string
}

export const FormTextarea = (props: FormTextareaProps & InputHTMLAttributes<any>) => {
    const {label, inputError, value, type, placeholder, onChange, disabled, className } = props;

    return (
        <div className={className}>
            <label>{label}</label>
            <textarea value={value} placeholder={placeholder} disabled={disabled} onChange={onChange}/>
            {inputError && 
                <UiText alert={true}>{inputError}</UiText>
            }
        </div>
    )
}