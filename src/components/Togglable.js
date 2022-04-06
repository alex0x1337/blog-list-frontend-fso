import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })
    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div className='togglableContent' style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>{props.hideLabel ? props.hideLabel : 'cancel'}</button>
            </div>
        </div>
    )
})


Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName = 'Toggleable'

export default Togglable