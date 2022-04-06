import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {
    let container
    const blog = {
        author: 'Michael Chan',
        title: 'React patterns',
        url: 'https://reactpatterns.com/',
        likes: 7
    }
    let mockHandler

    beforeEach(() => {
        mockHandler = jest.fn()
        container = render(<Blog blog={blog} likeBlog={mockHandler} removeBlog={mockHandler} />).container
    })


    test('at start url and number of likes are not rendered', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('at start blog author is displayed', () => {
        const element = screen.getByText(blog.author, { exact: false })
        expect(element).toBeDefined()
    })
    test('at start blog title is displayed', () => {
        const element = screen.getByText(blog.title, { exact: false })
        expect(element).toBeDefined()
    })

    test('blogs url and number of likes are shown when the button has been clicked', async () => {
        const button = screen.getByText('show')
        userEvent.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })


    test('if the like button is clicked twice, the event handler is called twice', async () => {
        const button = screen.getByText('like')
        userEvent.click(button)
        userEvent.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})
