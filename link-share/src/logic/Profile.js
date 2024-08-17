export class Profile {

    #linkArray

    constructor() {

        this.#linkArray = []

    }

    getLink() { return this.#linkArray }

    addLink(link) { this.#linkArray.push(link) } 

    removeLink(link) { this.#linkArray = this.#linkArray.filter(obj => obj.getId() !== link.getId()) }

}