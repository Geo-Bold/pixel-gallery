import { Session } from "./Session.js"
import { Database } from "./Database.js"

/**
 * The `LocalStorage` class provides an interface for interacting with the browser's localStorage API.
 * It allows storing, retrieving, and removing key-value pairs associated with a specific storage key.
 */
export class LocalStorage {

    #storageKey

    /**
     * Constructs a new `LocalStorage` instance.
     * Initializes the local storage with an empty object if the provided storage key does not exist.
     *
     * @param {string} storageKey - The unique key used to reference this localStorage entry.
     */
    constructor(storageKey) {

        this.#storageKey = storageKey

        const storageDoesNotContainKey = !localStorage.getItem(this.#storageKey)

        if (storageDoesNotContainKey) localStorage.setItem(this.#storageKey, JSON.stringify({}))

    }

    /**
     * Clears the local storage associated with the storage key.
     */
    clearStorage() { localStorage.removeItem(this.#storageKey) }

    /**
     * Retrieves the value associated with the specified key from local storage.
     *
     * @param {string} key - The key whose value needs to be retrieved.
     * @returns {any|null} - The value associated with the key, or `null` if the key does not exist.
     */
    getItem(key) {

        const storageData = this.retrieveStorageData()
        
        return storageData[key] || null

    }

    /**
     * Removes the specified key-value pair from local storage.
     *
     * @param {string} key - The key to be removed from local storage.
     */
    removeItem(key) {

        const storageData = this.retrieveStorageData()

        delete storageData[key]

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

    /**
     * Retrieves all data stored under the current storage key in local storage.
     *
     * @returns {Object|null} - The parsed object stored in local storage, or `null` if no data exists.
     */
    retrieveStorageData() {

        const storageData = localStorage.getItem(this.#storageKey)

        if (storageData) return JSON.parse(storageData)
            
        else return null

    }

    /**
     * Sets a key-value pair in local storage. If the key already exists, its value is updated.
     *
     * @param {string} key - The key to set or update in local storage.
     * @param {any} value - The value to associate with the key.
     */
    setItem(key, value) {

        const storageData = this.retrieveStorageData()

        storageData[key] = value

        localStorage.setItem(this.#storageKey, JSON.stringify(storageData))

    }

}