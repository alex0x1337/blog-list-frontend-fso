
import PropTypes from 'prop-types'

const Notification = ({ message, success }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={success ? 'success':'error'}>
            {message}
        </div>
    )
}

Notification.propTypes = {
    message: PropTypes.string,
    success: PropTypes.bool
}

export default Notification
