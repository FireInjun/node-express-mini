const express = require( 'express' );
const db = require( './data/db' );
const port = 5000;
const server = express();
server.use( express.json() );


const Users = new API( { url: `http://localhost:${ port }/api` } )
server.listen( port, () => console.log( `Server running on port ${ port }. Your API is located here at ${ URL }.` ) );
// const express = require( 'express' );
// const db = require( './data/db' )
// const API = require( './api' )
// const server = express();
// server.use( express.json() )
// const port = 5000;

// const myApi = new API( { url: 'http://localhost:5000/api' } )
// myApi.createUser( { name: 'users' } )

// server.get( myApi.url, ( _, res ) =>
// {
//     myApi.endpoints.users.find()
//         .then( response =>
//         {
//             res.status( 200 ).json( response )
//         } )
//         .catch( err => console.log( err ) )
//} )
//
// myApi.endpoints.users.findById("whatever")
//     .then(res => res.status(200).json(res))
//     .catch(err => console.log(err))



// server.listen( port, () => console.log( `Server running on port ${ port }.` ) )
