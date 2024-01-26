export class History {

    constructor() {
        this.history = [];
    }

    add(tool, changes) {
        this.history.add(new Change(tool, changes))
    }

}

class Change {

    constructor(tool, changes) {
        this.tool = tool;
        this.changes = changes;
    }

}