import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, removeBlog }) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const onClick = (id) => () => likeBlog(id)
    const onRemove = () => () => {
        if(window.confirm(`Remove blog ${blog.title}?`)) {
            removeBlog(blog.id)
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    return (
        <div style={blogStyle}>
            <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide':'show'}</button></div>
            <div className='togglableContent' style={showWhenVisible}>
                <div className="blogUrl">{blog.url}</div>
                <div className="blogLikes">{blog.likes} <button onClick={onClick(blog.id)}>like</button></div>
                {removeBlog && <div><button onClick={onRemove(blog)} style={{ backgroundColor: '#4085f6', borderRadius: 7 }}>remove</button></div>}
            </div>
        </div>
    )
}


Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func
}


export default Blog