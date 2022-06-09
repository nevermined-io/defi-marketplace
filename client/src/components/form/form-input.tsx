import React, { InputHTMLAttributes } from 'react'

interface FormInputProps {
    label: string,
}

export const FormInput = (props: FormInputProps & InputHTMLAttributes<any>) => {
    const {label, value, type, placeholder, onChange, disabled, className } = props;

    return (
        <div className={className}>
            <label>{label}</label>
            <input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={onChange}/>
        </div>
    )
}