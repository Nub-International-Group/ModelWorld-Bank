import swal from 'sweetalert'

function handleError (error) {
  console.log(error)
  swal({
    icon: 'error',
    title: 'Error: ' + error.response.data.err.code,
    text: error.response.data.err.desc
  })
}

export default handleError
