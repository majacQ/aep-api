export default {
  flatten: (array) => {
    var flattend = []
    !(function flat(array) {
      array.forEach(function(el) {
        if (Array.isArray(el)) flat(el)
        else flattend.push(el)
      })
    })(array)
    return flattend
  },
}
