import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <div className="navbar bg-primary text-primary-content my-3 relative z-50">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content outline outline-1 outline-primary text-primary rounded-box z-50 mt-3 w-52 p-2 shadow-lg">
                            <li><Link to="/qna" className="text-xl">QnA</Link></li>
                            <li><Link to="/sharedlib" className="text-xl">Library</Link></li>
                            <li><Link to="/emails" className="text-xl">ImpMails</Link></li>
                            <li>
                                <a className="text-xl">Lnf</a>
                                <ul className="p-2">
                                    <li><Link to="/lost" className="text-xl">Lost</Link></li>
                                    <li><Link to="/found" className="text-xl">Found</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-2xl">aDApt</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to="/qna" className="text-xl">QnA</Link></li>
                        <li><Link to="/sharedlib" className="text-xl">Library</Link></li>
                        <li><Link to="/emails" className="text-xl">ImpMails</Link></li>
                        <li>
                            <details>
                                <summary className="text-xl">LnF</summary>
                                <ul className="p-2 outline outline-2 outline-primary text-primary z-50">
                                    <li><Link to="/lost" className="text-xl">Lost</Link></li>
                                    <li><Link to="/found" className="text-xl">Found</Link></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <Link to="/signup" className="btn text-xl">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
