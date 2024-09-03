import { Session } from "./Session.js"
import { Database } from "./Database.js"

export class LocalStorage {

    #storageKey
    #database

    constructor(storageKey, database = null) {

        this.#storageKey = storageKey

        const storageDoesNotContainKey = !localStorage.getItem(this.#storageKey)

        if (storageDoesNotContainKey) localStorage.setItem(this.#storageKey, JSON.stringify({}))

        if (database) this.#database = database

    }

    retrieveStorageData() {

        const storageData = localStorage.getItem(this.#storageKey)

        if (storageData) return JSON.parse(storageData)
            
        else return null

    }

    getItem(key) {

        const storageData = this.retrieveStorageData()
        
        return storageData[key] || null

    }

    setItem(key, value) {

        const storageData = this.retrieveStorageData()

        storageData[key] = value

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

    removeItem(key) {

        const storageData = this.retrieveStorageData()

        delete storageData[key]

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

    clearStorage() { localStorage.removeItem(this.#storageKey) }

    compareProfileData(localData, cloudData) {

        if (localData.firstName !== cloudData.firstName || localData.lastName !== cloudData.lastName || localData.email !== cloudData.email || localData.url !== cloudData.url) return false

        return true

    }

}
