export class LocalStorage {

    #storageKey

    constructor(storageKey) {

        this.#storageKey = storageKey

        const storageDoesNotContainKey = !localStorage.getItem(this.#storageKey)

        if (storageDoesNotContainKey) localStorage.setItem(this.#storageKey, JSON.stringify({}))

    }

    #retrieveStorageData() {

        const storageData = localStorage.getItem(this.#storageKey)

        return storageData ? JSON.parse(storageData) : {}

    }

    getItem(key) {

        const storageData = this.#retrieveStorageData()
        
        return storageData[key] || null

    }

    setItem(key, value) {

        const storageData = this.#retrieveStorageData()

        storageData[key] = value

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

    removeItem(key) {

        const storageData = this.#retrieveStorageData()

        delete storageData[key]

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

    returnAllValues() { return this.#retrieveStorageData() }

    clearStorage() { localStorage.removeItem(this.#storageKey) }

}
