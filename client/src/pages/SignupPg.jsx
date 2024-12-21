import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js'
import { Users, User, Key, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'


const SignupPg = () => {
    const [showPass, setShowPass] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    })

    const [admin, setAdmin] = useState(false)
    const { signup, isSigningUp } = useAuthStore()

    const validateForm = () => {

    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        //for larger screen (lg) it would be grid of 2 columns
        <>
            <div className='min-h-screen '>
                {/* left-side  sm : smaller screen*/}
                <div className='flex flex-col justify-center items-center mt-12 p-6 sm:p-12'>
                    <div className='w-full max-w-md spce-y-8'>
                        <div className='text-center mb-8'>
                            <div className='flex flex-col items-center gap-2 group'>
                                <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                    <Users className='size-6 text-primary' />
                                </div>
                                <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
                                <p className='text-base-content/60'>Get started with your free account</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Full Name</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <User className='size-5 text-base-content/40' />
                                    </div>
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full pl-10`}
                                        placeholder='firstName LastName'
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Email</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='size-5 text-base-content/40' />
                                    </div>
                                    <input
                                        type="text"
                                        className={`input input-bordered w-full pl-10`}
                                        placeholder='xyz@email.com'
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Password</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock className='size-5 text-base-content/40' />
                                    </div>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        className={`input input-bordered w-full pl-10`}
                                        placeholder='******'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? (
                                            <EyeOff className='size-5 text-base-content/40' />
                                        ) : (
                                            <Eye className='size-5 text-base-content/40' />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {(admin &&
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>AdminKey</span>
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Key className='size-5 text-base-content/40' />
                                        </div>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            className={`input input-bordered w-full pl-10`}
                                            placeholder='******'
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? (
                                                <EyeOff className='size-5 text-base-content/40' />
                                            ) : (
                                                <Eye className='size-5 text-base-content/40' />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className='btn btn-primary w-full' disabled={isSigningUp}>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className='size-5 animate-spin' />
                                        Loading...
                                    </>
                                ) : (
                                    "Create Account"
                                )
                                }
                            </button>
                        </form>

                        <p className='text-base-content/60 text-xl my-3'>
                            Admin ? <span className='text-primary cursor-pointer'
                                onClick={() => { setAdmin(!admin) }}
                            >{admin ? "No" : "Yes"}</span>
                        </p>

                        <div className='text-center'>
                            <p className='text-base-content/60'>
                                Already have an account ? {" "}
                                <Link to='/login' className='link link-primary'>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignupPg
