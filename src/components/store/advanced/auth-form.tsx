'use client'

import React, { useState, useEffect } from 'react'
import { AuthLoginForm } from './auth-login-form'
import { AuthSignUpForm } from './auth-signup-form'
import { AuthAffiliateSignUpForm } from './auth-affiliate-signup-form'
import { AuthForgotPasswordForm } from './auth-forgot-password-form'
import { AuthUpdatePasswordForm } from './auth-update-password-form'
import { 
    signInAction, 
    signUpAction, 
    forgotPasswordAction, 
    updatePasswordAction 
} from '@/actions/auth-actions'
import { useSearchParams } from 'next/navigation'

interface AuthFormProps {
    view: 'login' | 'signup' | 'affiliate-signup' | 'forgot-password' | 'update-password'
}

export function AuthForm({ view }: AuthFormProps) {
    const searchParams = useSearchParams()
    
    // Common State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [role, setRole] = useState<'student' | 'trainer'>('trainer')
    const [acceptedTerms, setAcceptedTerms] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const result = await signInAction(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Handle SignUp
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!acceptedTerms) {
            setError('Você precisa aceitar os termos de uso.')
            return
        }

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('full_name', fullName)
        formData.append('whatsapp', whatsapp)
        formData.append('role', view === 'affiliate-signup' ? 'affiliate' : role)
        
        const ref = searchParams.get('ref')
        if (ref) formData.append('referred_by', ref)

        const result = await signUpAction(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Handle Forgot Password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('origin', window.location.origin)

        const result = await forgotPasswordAction(formData)
        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(result.success)
        }
        setLoading(false)
    }

    // Handle Update Password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('password', password)

        const result = await updatePasswordAction(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    switch (view) {
        case 'login':
            return (
                <AuthLoginForm 
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    onSubmit={handleLogin}
                    loading={loading}
                    error={error}
                />
            )
        case 'signup':
            return (
                <AuthSignUpForm 
                    fullName={fullName} setFullName={setFullName}
                    email={email} setEmail={setEmail}
                    whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                    password={password} setPassword={setPassword}
                    role={role} setRole={setRole}
                    acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms}
                    onSubmit={handleSignUp}
                    loading={loading}
                    error={error}
                />
            )
        case 'affiliate-signup':
            return (
                <AuthAffiliateSignUpForm 
                    fullName={fullName} setFullName={setFullName}
                    email={email} setEmail={setEmail}
                    whatsapp={whatsapp} setWhatsapp={setWhatsapp}
                    password={password} setPassword={setPassword}
                    acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms}
                    onSubmit={handleSignUp}
                    loading={loading}
                    error={error}
                />
            )
        case 'forgot-password':
            return (
                <AuthForgotPasswordForm 
                    email={email} setEmail={setEmail}
                    onSubmit={handleForgotPassword}
                    loading={loading}
                    error={error}
                    message={success}
                />
            )
        case 'update-password':
            return (
                <AuthUpdatePasswordForm 
                    password={password} setPassword={setPassword}
                    onSubmit={handleUpdatePassword}
                    loading={loading}
                    error={error}
                />
            )
        default:
            return <AuthLoginForm />
    }
}
