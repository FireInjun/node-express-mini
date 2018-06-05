const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const db = require( './data/db' );
const CORS = require( 'cors' );
const API = require( './userApi.js' );

const port = 5000;
const server = express();


server.use( express.json() );
server.use( bodyParser.json() );
server.use( bodyParser.urlencoded({extended: true}) );
server.use( CORS() );



const userApi = new API( { url: `http://localhost:5000/api` } )
const entities = [ 'users' ]
const requiredFields = { 'users': [ 'name', 'bio' ] }
userApi.createEntities(entities)

entities.forEach( each =>
{
    server.get( `/api/${ each }`, ( _, res ) =>
    {
        api.endpoints[ each ].getAll()
            .then( response => res.status( 200 ).json( response ) )
            .catch(err => res.status(500).json({errorMessage: `The ${each} information could not be retrieved.`}))
    } )
    server.get( `/api/${ each }/:id`, ( req, res ) =>
    {
        const { id } = req.params
        api.endpoints[ each ].getOne( { id } )
            .then( response =>
            {
                if ( response.length > 0 )
                {
                    res.status( 200 ).send( response )
                } else
                {
                    res.status( 404 ).json( { errorMessage: `The ${ each } with the specified ID does not exist.` } )
                }
            } )
            .catch( error =>
            {
                res.status( 500 ).json( { errorMessage: `The ${ each } information could not be retrieved.` } )
            } )
    } )

    // Insert one object to a specific entity
    server.post( `/api/${ each }`, ( req, res ) =>
    {
        const data = req.body
        for ( let i = 0; i < requiredFields[ each ].length; i++ )
        {
            const field = requiredFields[ each ][ i ]
            if ( !req.body[ field ] )
            {
                res.status( 400 ).json( { errorMessage: `Please provide ${ field } for the ${ each }.` } );
                return;
            }
        }

        userApi.endpoints[ each ].insert( { data } )
            .then( response =>
            {
                res.status( 200 ).json( { id: response[ 0 ], ...data } )
            } )
            .catch( err =>
            {
                res.status( 500 ).json( { errorMessage: `The ${ each } information could not be retrieved.` } )
            } )
    } )

    // Delete one object of a specific entity
    server.delete( `/api/${ each }/:id`, ( req, res ) =>
    {
        const { id } = req.params
        userApi.endpoints[ each ].remove( { id } )
            .then( response =>
            {
                if ( response === 1 )
                {
                    res.status( 200 ).send( `The ${ each } have been deleted` )
                } else
                {
                    res.status( 404 ).json( { errorMessage: `The ${ each } with the specified ID does not exist.` } )
                }
            } )
            .catch( error =>
            {
                res.status( 500 ).json( { errorMessage: `The ${ each } information could not be retrieved.` } )
            } )
    } )

    // Update one object of a specific entity
    server.put( `/api/${ each }/:id`, ( req, res ) =>
    {
        const data = req.body
        const { id } = req.params

        // check if updated object contains all required fields
        for ( let i = 0; i < requiredFields[ each ].length; i++ )
        {
            const field = requiredFields[ each ][ i ]
            if ( !req.body[ field ] )
            {
                res.status( 400 ).json( { errorMessage: `Please provide ${ field } for the ${ each }.` } );
                return;
            }
        }

        // for other entities
        userApi.endpoints[ each ].update( { id, data } )
            .then( response =>
            {
                if ( response === 1 )
                {
                    res.status( 200 ).send( `The ${ each } have been updated` )
                } else
                {
                    res.status( 404 ).json( { errorMessage: `The ${ each } with the specified ID does not exist.` } )
                }
            } )
            .catch( err =>
            {
                res.status( 500 ).json( { errorMessage: `The ${ each } information could not be retrieved.` } )
            } )
    } )

} )


server.listen( port, () =>
{
    console.log( `Server listening on port ${ port }` );
} )
