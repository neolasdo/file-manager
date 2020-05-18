export default {
  sortFiles: state => {
    return state.files.sort(function(a, b){
      if (state.sortKey === 'name') {
        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        if (state.sortType === 'ASC') {
          return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
        } else {
          return nameA < nameB ? 1 : (nameA > nameB ? -1 : 0)
        }
      }
      else if (state.sortKey === 'created_at') {
        let dateA = new Date(a.retiredate), dateB = new Date(b.retiredate)
        if (state.sortType === 'ASC') {
          return dateA - dateB
        } else {
          return dateB - dateA
        }
      }
      else return 0
    })
  }
}
