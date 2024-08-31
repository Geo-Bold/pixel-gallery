import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export class Session {
    
    #client
    #user
    #isLoggedIn = false 
    #databaseUrl = 'https://cvxtjsrqrjwhtmxkzwbz.supabase.co'
    #anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eHRqc3Jxcmp3aHRteGt6d2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxODA1ODYsImV4cCI6MjAzNzc1NjU4Nn0.tpsW736ywZy-CHU5lkm0zcOZo_PwbUpuAwwVd7lXqUU'

    constructor() {

        this.#client = createClient(this.#databaseUrl, this.#anonKey)

        this.#user = null

        this.addEventListener()

    }

    async createUser({ email, password }) {

        const { user, error } = await this.#client.auth.signUp({ email, password })

        if (error) throw new Error(error.message)

        this.#user = user

        this.#isLoggedIn = true

        return user

    }

    addEventListener() {

        this.#client.auth.onAuthStateChange((event, session) => {

            if (event === 'INITIAL_SESSION') {
                console.log('session created')
            } else if (event === 'SIGNED_IN') {
                console.log('user is logged in')
            } else if (event === 'SIGNED_OUT') {
                console.log('user is logged out')
            } else if (event === 'PASSWORD_RECOVERY') {
                console.log('password reset')
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('session refreshed')
            } else if (event === 'USER_UPDATED') {
                console.log('user info updated')
            }

        })

    }

    async signInUser({ email, password }) {

        const { user, error } = await this.#client.auth.signInWithPassword({ email, password })

        if (error) throw new Error(error.message)

        this.#user = user

        this.#isLoggedIn = true

        return user

    }

    async signOutUser() {

        const { error } = await this.#client.auth.signOut()

        if (error) throw new Error(error.message)

        this.#user = null

        this.#isLoggedIn = false

        return this.#user

    }

    getUser() {

        console.log('working')
        
        return this.#user 
    
    }

    async retrieveSession() {

        const { data, error } = await this.#client.auth.getSession()

        if (error) throw new Error(error.message)

        this.#user = data.session?.user ?? null

        this.#isLoggedIn = !!this.#user

        return this.#user

    }

    isLoggedIn() { return this.#isLoggedIn }

    async refreshSession() {

        const { data, error } = await this.#client.auth.refreshSession()

        if (error) throw new Error(error.message)

        this.#user = data.session?.user ?? null

        this.#isLoggedIn = !!this.#user

        return this.#user

    }

    async updateUserProfile(updates) {

        const { user, error } = await this.#client.auth.updateUser(updates)

        if (error) throw new Error(error.message)

        this.#user = user

        return user

    }

    async resetPassword(email) {

        const { error } = await this.#client.auth.resetPasswordForEmail(email)

        if (error) throw new Error(error.message)

        return 'Password reset email sent.'

    }

    async updatePassword(newPassword) {

        const { error } = await this.#client.auth.updateUser({ password: newPassword })

        if (error) throw new Error(error.message)

        return 'Password updated successfully.'

    }

    async getUserDetails() {

        if (!this.#isLoggedIn) throw new Error('User is not logged in.')

        const { data, error } = await this.#client.from('profiles').select('*').eq('id', this.#user.id).single()

        if (error) throw new Error(error.message)

        return data

    }

    isSessionExpired() {

        if (!this.#user) return true

        const session = this.#client.auth.session()

        if (!session) return true

        const expiresAt = session.expires_at * 1000 // Convert to milliseconds

        return Date.now() >= expiresAt

    }

}
