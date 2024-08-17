class Session {

    #client
    #user
    #databaseUrl = '' 
    #anonKey = ''

    constructor() {

        this.#client = supabase.createClient(this.#databaseUrl, this.#anonKey)

        this.#user = null

    }

    async createUser({ email, password }) {

        const { user, error } = await this.#client.auth.signUp({ email, password })

        if (error) throw new Error(error.message)

        this.#user = user

        return user

    }

    addEventListener(element, event, handler) { element.addEventListener(event, handler) }

    async signInUser({ email, password }) {

        const { user, error } = await this.#client.auth.signInWithPassword({ email, password })

        if (error) throw new Error(error.message)

        this.#user = user

        return user

    }

    async signOutUser() {

        const { error } = await this.#client.auth.signOut()

        if (error) throw new Error(error.message)

        this.#user = null

        return this.#user

    }

    getUser() { return this.#user }

    async retrieveSession() {

        const { data, error } = await this.#client.auth.getSession()

        if (error) throw new Error(error.message)

        this.#user = data.session?.user ?? null

        return this.#user
        
    }
}
