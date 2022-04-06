import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({
    createBlog
}) => {
    const [author, setAuthor] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateBlog = async (event) => {
        event.preventDefault()
        if (createBlog({ title, author, url })) {
            setTitle('')
            setUrl('')
            setAuthor('')
        }
    }

    return (
        <form onSubmit={handleCreateBlog}>
            <div>
                title
                <input
                    type="text"
                    value={title}
                    name="title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={author}
                    name="author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )
}


CreateBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default CreateBlogForm