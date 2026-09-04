const http   = require( 'http' ),
      fs     = require( 'fs' ),
      crypto = require( 'crypto' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime   = require( 'mime' ),
      dir    = 'public/',
      port   = 3000

// derives an efficiency rating and an age category from fields already
// present on the car (mpg and year) before the row is stored
const addDerivedFields = function( car ) {
  let efficiency
  if( car.mpg >= 30 ) efficiency = 'Excellent'
  else if( car.mpg >= 20 ) efficiency = 'Good'
  else efficiency = 'Poor'

  const ageCategory = car.year < 2000 ? 'Classic' : 'Modern'

  return { id: car.id, model: car.model, year: car.year, mpg: car.mpg, efficiency, ageCategory }
}

let cars = [
  { id: crypto.randomUUID(), model: 'Toyota Corolla', year: 1999, mpg: 23 },
  { id: crypto.randomUUID(), model: 'Honda Civic', year: 2004, mpg: 30 },
  { id: crypto.randomUUID(), model: 'Ford Mustang', year: 1987, mpg: 14 }
].map( addDerivedFields )

const server = http.createServer( function( request, response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ) {
    handlePost( request, response )
  }else if( request.method === 'PUT' ) {
    handlePut( request, response )
  }else if( request.method === 'DELETE' ) {
    handleDelete( request, response )
  }
})

const handleGet = function( request, response ) {
  if( request.url === '/cars' ) {
    sendJSON( response, cars )
    return
  }

  const filename = request.url === '/' ? dir + 'index.html' : dir + request.url.slice( 1 )
  sendFile( response, filename )
}

const handlePost = function( request, response ) {
  readBody( request, function( data ) {
    const newCar = addDerivedFields({
      id: crypto.randomUUID(),
      model: data.model,
      year: Number( data.year ),
      mpg: Number( data.mpg )
    })

    cars.push( newCar )
    sendJSON( response, cars )
  })
}

const handlePut = function( request, response ) {
  const id = request.url.split( '/' )[ 2 ]

  readBody( request, function( data ) {
    cars = cars.map( function( car ) {
      if( car.id !== id ) return car

      return addDerivedFields({
        id,
        model: data.model,
        year: Number( data.year ),
        mpg: Number( data.mpg )
      })
    })

    sendJSON( response, cars )
  })
}

const handleDelete = function( request, response ) {
  const id = request.url.split( '/' )[ 2 ]
  cars = cars.filter( function( car ) { return car.id !== id })
  sendJSON( response, cars )
}

const readBody = function( request, callback ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {
    callback( JSON.parse( dataString ) )
  })
}

const sendJSON = function( response, data ) {
  response.writeHead( 200, { 'Content-Type': 'application/json' })
  response.end( JSON.stringify( data ) )
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename )

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHead( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHead( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
