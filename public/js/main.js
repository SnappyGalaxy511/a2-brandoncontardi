// FRONT-END (CLIENT) JAVASCRIPT HERE

let currentCars = []
const state = { editingId: null }

const fetchCars = async function() {
  const response = await fetch( '/cars' )
  const cars = await response.json()
  currentCars = cars
  renderTable( cars )
}

const renderTable = function( cars ) {
  const tbody = document.querySelector( '#car-table-body' )
  tbody.innerHTML = ''

  cars.forEach( function( car ) {
    const row = document.createElement( 'tr' )

    row.appendChild( makeCell( car.model ) )
    row.appendChild( makeCell( car.year ) )
    row.appendChild( makeCell( car.mpg ) )
    row.appendChild( makeCell( car.efficiency, 'efficiency-' + car.efficiency.toLowerCase() ) )
    row.appendChild( makeCell( car.ageCategory ) )

    const actions = document.createElement( 'td' )

    const editButton = document.createElement( 'button' )
    editButton.textContent = 'Edit'
    editButton.className = 'edit-btn'
    editButton.dataset.id = car.id

    const deleteButton = document.createElement( 'button' )
    deleteButton.textContent = 'Delete'
    deleteButton.className = 'delete-btn'
    deleteButton.dataset.id = car.id

    actions.appendChild( editButton )
    actions.appendChild( deleteButton )
    row.appendChild( actions )

    tbody.appendChild( row )
  })
}

const makeCell = function( text, className ) {
  const cell = document.createElement( 'td' )
  cell.textContent = text
  if( className ) cell.className = className
  return cell
}

const handleSubmit = async function( event ) {
  event.preventDefault()

  const model = document.querySelector( '#model' ).value.trim(),
        year  = document.querySelector( '#year' ).value,
        mpg   = document.querySelector( '#mpg' ).value

  if( !model || !year || !mpg ) return

  const json = { model, year, mpg },
        body = JSON.stringify( json )

  const url    = state.editingId ? `/cars/${ state.editingId }` : '/cars',
        method = state.editingId ? 'PUT' : 'POST'

  const response = await fetch( url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body
  })

  const cars = await response.json()
  currentCars = cars
  renderTable( cars )
  resetForm()
}

const handleTableClick = async function( event ) {
  const target = event.target,
        id     = target.dataset.id

  if( !id ) return

  if( target.classList.contains( 'delete-btn' ) ) {
    const response = await fetch( `/cars/${ id }`, { method: 'DELETE' } )
    const cars = await response.json()
    currentCars = cars
    renderTable( cars )

    if( state.editingId === id ) resetForm()

  }else if( target.classList.contains( 'edit-btn' ) ) {
    const car = currentCars.find( function( c ) { return c.id === id })
    if( !car ) return

    document.querySelector( '#model' ).value = car.model
    document.querySelector( '#year' ).value = car.year
    document.querySelector( '#mpg' ).value = car.mpg

    state.editingId = id
    document.querySelector( '#submit-btn' ).textContent = 'Update Car'
    document.querySelector( '#cancel-btn' ).hidden = false
  }
}

const resetForm = function() {
  document.querySelector( '#car-form' ).reset()
  state.editingId = null
  document.querySelector( '#submit-btn' ).textContent = 'Add Car'
  document.querySelector( '#cancel-btn' ).hidden = true
}

window.onload = function() {
  document.querySelector( '#car-form' ).addEventListener( 'submit', handleSubmit )
  document.querySelector( '#car-table-body' ).addEventListener( 'click', handleTableClick )
  document.querySelector( '#cancel-btn' ).addEventListener( 'click', resetForm )

  fetchCars()
}
