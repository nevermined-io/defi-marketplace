import React, { InputHTMLAttributes } from 'react'
import { UiText } from 'ui'

interface FormSelectProps {
    label: string,
    inputError?: string
}

export const FormSelect = (props: FormSelectProps & InputHTMLAttributes<any>) => {
    const {label, inputError, value, type, placeholder, onChange, disabled, className } = props;

    var state = {value: 'coconut'};
    const handleChange= (event: any) => {
        console.log('previous ' +  state.value)
        state = {value: event.target.value};
        console.log('new ' +  state.value)
    }
    
    
    return (
        <div className={className}>
            <label>{label}</label>
            <select value={state.value} onChange={handleChange}>
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
            </select>
            {inputError && 
                <UiText variants={['error']}>{inputError}</UiText>
            }
        </div>
    )
}