import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { Renderer } from './Renderer.js'

export class Session {

    static #anonKey
    static #client
    static #databaseUrl
    static #isLoggedIn = false
    static #user
    
    static async initialize() {

        Session.#anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eHRqc3Jxcmp3aHRteGt6d2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxODA1ODYsImV4cCI6MjAzNzc1NjU4Nn0.tpsW736ywZy-CHU5lkm0zcOZo_PwbUpuAwwVd7lXqUU'

        Session.#databaseUrl = 'https://cvxtjsrqrjwhtmxkzwbz.supabase.co'

        Session.#client = createClient(Session.#databaseUrl, Session.#anonKey)

        Session.#user = null

        Session.addEventListener()

        await Session.refreshSession()

    }

    static addEventListener() {

        Session.#client.auth.onAuthStateChange(event => {

            switch (event) {
                
                case 'INITIAL_SESSION':

                    console.log('session created')

                    break
    
                case 'SIGNED_IN':

                    console.log('user is logged in')

                    this.#isLoggedIn = true

                    Renderer.render(null, 'auth')

                    break
    
                case 'SIGNED_OUT':

                    console.log('user is logged out')

                    this.#isLoggedIn = false

                    Renderer.render(null, 'auth')

                    break
    
                case 'PASSWORD_RECOVERY':

                    console.log('password reset')

                    break
    
                case 'TOKEN_REFRESHED':

                    console.log('session refreshed')

                    break
    
                case 'USER_UPDATED':

                    console.log('user info updated')

                    break
    
                default:

                    console.log('Unhandled event:', event)

                    break

            }
            
        })

    }

    static async createUser({ email, password }) {

        const { user, error } = await Session.#client.auth.signUp({ email, password })

        if (error) throw new Error(error.message)

        Session.#user = user

        Session.#isLoggedIn = true

        return user

    }

    static getClient() { return this.#client }

    static getUser() { return Session.#user }

    static async getUserDetails() {

        if (!Session.#isLoggedIn) throw new Error('User is not logged in.')

        const { data, error } = await Session.#client.from('profiles').select('*').eq('id', Session.#user.id).single()

        if (error) throw new Error(error.message)

        return data

    }

    static isLoggedIn() { return Session.#isLoggedIn }

    static isSessionExpired() {

        if (!Session.#user) return true

        const session = Session.#client.auth.session()

        if (!session) return true

        const expiresAt = session.expires_at * 1000 // Convert to milliseconds

        return Date.now() >= expiresAt

    }

    static async refreshSession() {

        try {
            
            const { data, error } = await Session.#client.auth.refreshSession()

            if (error) throw new Error(error.message)

            Session.#user = data.session?.user ?? null

            Session.#isLoggedIn = !!Session.#user

            return Session.#user

        } catch (error) {
            
            console.error('Error in refreshSession:', error.message)

            return null

        }

    }

    static async resetPassword(email) {

        const { error } = await Session.#client.auth.resetPasswordForEmail(email)

        if (error) throw new Error(error.message)

        return 'Password reset email sent.'

    }

    static async retrieveSession() {

        const { data, error } = await Session.#client.auth.getSession()

        if (error) throw new Error(error.message)

        Session.#user = data.session?.user ?? null

        Session.#isLoggedIn = !!Session.#user

        return Session.#user

    }

    static async signInUser({ email, password }) {

        const { user, error } = await Session.#client.auth.signInWithPassword({ email, password })

        if (error) throw new Error(error.message)

        Session.#user = user

        Session.#isLoggedIn = true

        return user

    }

    static async signOutUser() {

        const { error } = await Session.#client.auth.signOut()

        if (error) throw new Error(error.message)

        Session.#user = null

        Session.#isLoggedIn = false

        return Session.#user

    }

    static async updatePassword(newPassword) {

        const { error } = await Session.#client.auth.updateUser({ password: newPassword })

        if (error) throw new Error(error.message)

        return 'Password updated successfully.'

    }

    static async updateUserProfile(updates) {

        const { user, error } = await Session.#client.auth.updateUser(updates)

        if (error) throw new Error(error.message)

        Session.#user = user

        return user

    }

}