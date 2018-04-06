import swal from 'sweetalert2'

function handleError (error) {
  console.log(error)
  swal({
    type: 'error',
    title: 'Error: ' + error.response.data.err.code,
    text: error.response.data.err.desc
  })
}

export default handleError
