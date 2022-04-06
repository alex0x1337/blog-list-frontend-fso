import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({})
    const blogFormRef = useRef()

    const sortByLikes = (a, b) => b.likes-a.likes

    useEffect(() => {
        blogService.getAll().then(blogs => {
            let sortedBlogs = [...blogs].sort(sortByLikes)
            console.log('sortedBlogs', sortedBlogs)
            setBlogs( sortedBlogs )
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const notify = (message, success) => {
        setNotification({ success: success, message: message })
        setTimeout(() => {
            setNotification({})
        }, 5000)
    }
    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            notify('logging in', true)
        } catch (exception) {
            notify('Wrong username or password')
            return false
        }
        return true
    }

    const handleLogout = () => {
        window.localStorage.clear()
        setUser(null)
        notify('logged out', true)
    }

    const handleCreateBlog = async (blogObject) => {
        try {
            const blog = await blogService.create(blogObject)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(blog).sort(sortByLikes))
            notify(`created blog ${blogObject.title}`, true)
        } catch (error) {
            notify('failed to create blog')
            return false
        }
        return true
    }

    const handleLikeBlog = async (blogId) => {
        const blog = blogs.find((blog) => blog.id === blogId)
        if(blog) {
            blog.likes++
            try {
                const blogObject = {
                    user: blog.user.id,
                    likes: blog.likes,
                    author: blog.author,
                    title: blog.title,
                    url: blog.url
                }
                const updatedBlog = await blogService.update(blogId, blogObject)
                setBlogs(blogs.filter((blog) => blog.id !== blogId).concat(updatedBlog).sort(sortByLikes))
                notify(`liked the post ${blog.title}`, true)
            } catch(error) {
                blog.likes--
                notify('failed to add like')
            }

        }
    }

    const handleRemoveBlog = async (blogId) => {
        const blog = blogs.find((blog) => blog.id === blogId)
        if(blog) {
            try {
                await blogService.remove(blog.id)
                setBlogs(blogs.filter((blog) => blog.id !== blogId))
                notify(`removed blog ${blog.title}`, true)
            } catch(error) {
                notify('failed to remove blog')
            }
        }
    }

    const loginForm = () => (
        <Togglable buttonLabel='log in'>
            <LoginForm login={handleLogin} />
        </Togglable>
    )

    const createBlogForm = () => (
        <Togglable buttonLabel='create blog' ref={blogFormRef} >
            <CreateBlogForm createBlog={handleCreateBlog} />
        </Togglable>
    )

    return (
        <div>
            <h2>blogs</h2>
            {notification.message && <Notification message={notification.message} success={notification.success} />}
            {user === null ?
                loginForm() :
                <div>
                    <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
                    <h2>create new</h2>
                    <div>{createBlogForm()}</div>
                    <div className="blogList">{blogs.map(blog => {
                        return <Blog
                            key={blog.id}
                            likeBlog={handleLikeBlog}
                            removeBlog={blog.user && blog.user.username === user.username ? handleRemoveBlog : null}
                            blog={blog}
                        />
                    })}
                    </div>
                </div>
            }
        </div>
    )
}

export default App
