'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const jwtMiddleware = async ({ request }, next) => {
    request.headers().authorization = `Bearer ${request.cookie('XSStoken')}`
    await next()
}

Route.on('/').render('welcome')

// Authentication
Route.post('/login', 'UserController.login')
Route.post('/signup', 'UserController.addNewUser')
Route.post('/session', 'UserController.checkSession').middleware(jwtMiddleware)
Route.post('/logout', 'UserController.logout')

// Teams/Rooms
Route.post('/createTeam', 'RoomController.create').middleware(jwtMiddleware)
Route.post('/joinTeam', 'RoomController.join').middleware(jwtMiddleware)
Route.post('/deleteTeam', 'RoomController.delete')


Route.get('/activeItems', ({ request, response}) => {

})

Route.get('/inprogressItems', ({ request, response}) => {
    
})

Route.get('/completedItems', ({ request, response}) => {
    
})

Route.get('/backlog', ({ request, response}) => {
    
})