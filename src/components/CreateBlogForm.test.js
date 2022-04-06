import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'



describe('<CreateBlogForm />', () => {
    let container
    let mockHandler

    beforeEach(() => {
        mockHandler = jest.fn()
        container = render(<CreateBlogForm createBlog={mockHandler} />).container
    })

    test('form calls the event handler it received as props with the right details when a new blog is created', () => {
        const button = container.querySelector('button[type="submit"]')
        userEvent.click(button)
        expect(mockHandler.mock.calls).toHaveLength(1)
    })

})