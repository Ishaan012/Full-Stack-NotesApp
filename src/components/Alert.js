import React from 'react'

const Alert = (props) => {
    return (
        <div>
            <div className=" my-3 container alert alert-primary" role="alert">
                {props.message}
            </div>
        </div>
    )
}

export default Alert
