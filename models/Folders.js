class Folder {
  constructor(foldId, parentId, depth, access) {
    this.foldId = foldId;
    this.parentId = parentId;
    this.depth = depth;
    this.access = access;
  }

  getFolderObj = () => {
    return {
      foldId: this.foldId,
      parentId: this.parentId,
      depth: this.depth,
      access: this.access
    }
  }
}
module.exports = Folder