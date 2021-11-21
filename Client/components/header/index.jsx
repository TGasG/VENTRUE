import Button from '../button';
import style from './styles.module.css';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ProfileIcon from '../icons/profile';
import LogoutIcon from '../icons/logout';
import instance from '../../config/axios';
import Router from 'next/router';

export default function Header({ status, user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdown = useRef(null);

    const handlerLogout = () =>
        instance.get('/api/user/logout').then(() => Router.push('/auth/login'));

    useEffect(() => {
        if (!showDropdown) return;

        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [showDropdown]);

    return (
        <div className={`${style.header} flex justify-between items-center`}>
            <div className="flex gap-7 items-center">
                <Link href="/">
                    <img
                        src="/images/1.png"
                        alt="Ventrue logo"
                        className="w-39 h-7 cursor-pointer"
                    />
                </Link>
                <a href="/home">Home</a>
                {status === 'organization' && (
                    <>
                        <a href="/events/create">Create Event</a>
                    </>
                )}
                {status === 'admin' && (
                    <>
                        <a href="">Manage</a>
                        <a href="/create-ormawa">Create Ormawa</a>
                    </>
                )}
            </div>
            <div className="flex items-center">
                {status === 'guest' && (
                    <>
                        <a href="/auth/register" className="px-7">
                            Register
                        </a>
                        <Button
                            size="small"
                            state="primary"
                            color="lightGreen"
                            href="/auth/login"
                        >
                            Login
                        </Button>
                    </>
                )}
                {status === 'user' && (
                    <>
                        <img
                            src="/images/profile-image.png"
                            alt="Profile picture"
                            className="rounded-full w-12 h-12 mr-4 avatar-frame"
                        />
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center relative cursor-pointer"
                        >
                            <p className="pr-1.5">{user.name}</p>
                            <Icon icon="akar-icons:chevron-down" />
                            {showDropdown && (
                                <div
                                    className={`absolute -bottom-20 -right-0 ${style.dropdown}`}
                                >
                                    <a
                                        href="/users/profile"
                                        className="flex items-center px-1.5 mt-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="akar-icons:person" />
                                        <p className="pl-2.5">Profile</p>
                                    </a>
                                    <div
                                        onClick={handlerLogout}
                                        className="flex items-center px-1.5 mb-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="bx:bx-log-out" />
                                        <p className="pl-2.5">Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {status === 'organization' && (
                    <>
                        <img
                            src="/images/profile-image.png"
                            alt="Profile picture"
                            className="rounded-full w-12 h-12 mr-4 avatar-frame"
                        />
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center relative cursor-pointer"
                        >
                            <p className="pr-1.5">{user.name}</p>
                            <Icon icon="akar-icons:chevron-down" />
                            {showDropdown && (
                                <div
                                    className={`absolute -bottom-20 -right-0 ${style.dropdown}`}
                                >
                                    <a
                                        href="/users/profile"
                                        className="flex items-center px-1.5 mt-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="akar-icons:person" />
                                        <p className="pl-2.5">Profile</p>
                                    </a>
                                    <div
                                        onClick={handlerLogout}
                                        className="flex items-center px-1.5 mb-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="bx:bx-log-out" />
                                        <p className="pl-2.5">Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {status === 'admin' && (
                    <>
                        <img
                            src="/images/profile-image.png"
                            alt="Profile picture"
                            className="rounded-full w-12 h-12 mr-4 avatar-frame"
                        />
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center relative cursor-pointer"
                        >
                            <p className="pr-1.5">{user.name}</p>
                            <Icon icon="akar-icons:chevron-down" />
                            {showDropdown && (
                                <div
                                    className={`absolute -bottom-20 -right-0 ${style.dropdown}`}
                                >
                                    <a
                                        href="/users/profile"
                                        className="flex items-center px-1.5 mt-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="akar-icons:person" />
                                        <p className="pl-2.5">Profile</p>
                                    </a>
                                    <a
                                        href="/web-stats"
                                        className="flex items-center px-1.5 mt-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="bx:bx-stats" />
                                        <p className="pl-2.5">Web Stats</p>
                                    </a>
                                    <div
                                        onClick={handlerLogout}
                                        className="flex items-center px-1.5 mb-1 hover:bg-gray-200"
                                    >
                                        <Icon icon="bx:bx-log-out" />
                                        <p className="pl-2.5">Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
