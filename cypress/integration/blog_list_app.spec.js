
describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('log in').click()
        cy.get('button[type="submit"]')
    })
    it('login fails with wrong password', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong')
        cy.get('button[type="submit"]').click()
        cy.get('.error').contains('Wrong username or password')
    })
    it('login succeeds with correct password', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('button[type="submit"]').click()
        cy.get('.success').contains('logging in')
    })
})

describe('when logged in', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
        cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('logged-in user can create a new blog', function() {
        cy.contains('create blog').click()
        cy.get('[name="title"]').type('test blog title')
        cy.get('[name="author"]').type('test blog author')
        cy.get('[name="url"]').type('test blog url')
        cy.get('button[type="submit"]').click()
        cy.get('.success').contains('created blog')
        cy.get('.blogList').contains('test blog title')
        cy.get('.blogList').contains('test blog author')
        cy.get('.blogList').contains('test blog url')
    })

    it('logged-in user can like blog', function() {
        cy.createBlog({ title: 'test blog title', author: 'test blog author', url: 'test blog url' })
        cy.contains('show').click()
        cy.contains('like').click()
        cy.get('.blogLikes').contains('1')
        cy.get('.success').contains('liked the post')
    })

    it('logged-in user can delete their blogs', function() {
        cy.createBlog({ title: 'test blog title', author: 'test blog author', url: 'test blog url' })
        cy.visit('http://localhost:3000')
        cy.contains('show').click()
        cy.contains('remove').click()
        cy.get('.success').contains('removed blog')
        cy.get('.blogList').should('not.contain', 'test blog title')
    })


    it.only('blogs are ordered according to likes', function() {
        cy.createBlog({ title: 'test blog 1', author: 'test blog 1 author', url: 'test blog 1 url', likes: 10 })
        cy.createBlog({ title: 'test blog 2', author: 'test blog 2 author', url: 'test blog 2 url', likes: 5 })
        cy.createBlog({ title: 'test blog 3', author: 'test blog 3 author', url: 'test blog 3 url', likes: 20 })
        cy.wait(500)
        cy.visit('http://localhost:3000')
        cy.contains('show').click()
        cy.contains('show').click()
        cy.contains('show').click()
        cy.get('.blogList')
            .find('.blogLikes')
            .then(($els) => Cypress.$.makeArray($els).map((el) => Number(el.innerText.trim().split(' ')[0])))
            .should('deep.equal', [20, 10, 5])
    })
})