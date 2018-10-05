import React from 'react';
import '../App.css'

const FormErrors = ({formErrors}) => {
    return(
    <div>
        {Object.keys(formErrors).map((fieldName, i) => {
            if(formErrors[fieldName].length > 0){
                return (
                    <p key={i} className="invalid-input">{formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>
    );
}

export default FormErrors;