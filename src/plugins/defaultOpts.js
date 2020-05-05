const optionsDefaults = {
  // Retrieves the current logged in user that is posting a comment
  commenterSelector() {
    return {
      id: null,
      fullName: 'Anonymous',
      initials: '--',
      email: null
    }
  },
  data: {
    // Hash object of all elements that can be commented on
    targets: {},
    onCreate(created) {
      this.targets[created.targetId].comments.push(created)
    },
    onEdit(editted) {
      // This is obviously not necessary
      // It's there to illustrate what could be done in the callback of a remote call
      let comments = this.targets[editted.targetId].comments
      comments.splice(comments.indexOf(editted), 1, editted);
    },
    onRemove(removed) {
      let comments = this.targets[removed.targetId].comments
      comments.splice(comments.indexOf(removed), 1);
    }
  }
}

export default optionsDefaults
