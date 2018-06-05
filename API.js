//const axios = require( 'axios' );
const server = require( './server' );
const db = require( './data/db' );

class API
{

    constructor( { url } )
    {
        this.url = url
        this.endpoints = {}
    }
    /**
     * Create and store a single entity's endpoints
     * @param {A entity Object} entity
     */
    createEntity( entity )
    {
        this.endpoints[ entity.name ] = this.createBasicCRUDEndpoints( entity )
    }

    createEntities( arrayOfEntity )
    {
        arrayOfEntity.forEach( this.createEntity.bind( this ) )
    }
    /**
     * Create the basic endpoints handlers for CRUD operations
     * @param {A entity Object} entity
     */
    createBasicCRUDEndpoints( { name } )
    {
        var endpoints = {}

        const resourceURL = `${ this.url }/${ name }`

        endpoints.getAll = ( { query } = {} ) => axios.get( resourceURL, { params: { query } } )

        endpoints.getOne = ( { id } ) => axios.get( `${ resourceURL }/${ id }` )

        endpoints.create = ( toCreate ) => axios.post( resourceURL, toCreate )

        endpoints.update = ( toUpdate ) => axios.put( `${ resourceURL }/${ toUpdate.id }`, toUpdate )

        endpoints.patch = ( { id }, toPatch ) => axios.patch( `${ resourceURL }/${ id }`, toPatch )

        endpoints.delete = ( { id } ) => axios.delete( `${ resourceURL }/${ id }` )

        return endpoints

    }

}

export default API
//
//
//
//
//
//
//
//
//
//



//This is my API file, I have it separated from the server.js file so that I can keep my code cleaner and simplify my calls.


// Named methods on db.js
// find,
// findById,
// insert,
// update,
// remove.




class API
{

    constructor( { url } )
    {
        this.url = "/api/users"
        this.endpoints = {}
    }
    // Create and store a single entity's endpoints
    //@param {A user Object} user
    createUser( user )
    {
        this.endpoints[ user.name ] = this.createBasicCRUDEndpoints( user )
    }

    createUsers( users )
    {
        users.forEach( this.createUser.bind( this ) )
    }

    //Create the basic endpoints handlers for CRUD operations
    // @param {A user Object} user

    createBasicCRUDEndpoints( { name } )
    {
        var endpoints = {}

        const resourceURL = `${ this.url }/${ name }`

        // find (all)
        endpoints.find = ( { query } = {} ) => db.find()


        // findById
        endpoints.findById = ( { id } ) =>
            server.get( `${ resourceURL }/${ id }`, ( req, res ) =>
            {
                const { id } = req.params;
                const { name, bio } = req.body;
                db
                    .findById( { id } )
                    .then( users =>
                    {
                        res.json( { users: id } );
                    } )
                    .catch( error =>
                    {
                        res.json( { error } );
                    } );
            } )

        // insert
        endpoints.insert = ( toInsert ) =>
            server.post( resourceURL, ( req, res ) =>
            {
                const { name, bio } = req.body;
                db
                    .insert( { name, bio } )
                    .then( response =>
                    {
                        res.json( response );
                    } )
                    .catch( error =>
                    {
                        console.log( error )
                        res.json( error );
                    } );
            } )

        // update
        endpoints.update = ( toUpdate ) =>
            server.put( `${ resourceURL }/${ update.id }`, ( req, res ) =>
            {
                const { id } = req.params;
                const { name, bio } = req.body;
                const selectedUserForUpdate = user =>
                {
                    return
                    db
                        .findById( { id } ) == id;
                };
                if ( !selectedUserForUpdate )
                {
                    return sendUserError( 'No user to edit!'.res );
                } else
                {
                    if ( name ) selectedUserForUpdate.name = name;
                    if ( bio ) selectedUserForUpdate.bio = bio;
                    res.json( users );
                }
            } )

        // remove
        endpoints.remove = ( { id } ) =>
            server.delete( `${ resourceURL }/${ id }`, ( req, res ) =>
            {
                const { id } = req.params;
                const { name, bio } = req.body;
                const selectedUserforRemoval = user =>
                {
                    return
                    db
                        .findById( { id } ) == id;
                };

                if ( selectedUserforRemoval )
                {
                    const userRemoved = { ...selectedUserforRemoval };
                    users = users.filter( user => users.id != id );
                    res.status( 200 ).json( users );
                } else
                {
                    sendUserError( "No user matches that ID to delete! You probably ran them off already...", res );
                }
            } )

        return endpoints
    }
}

module.exports = API
