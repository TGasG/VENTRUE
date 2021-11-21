import Header from '../../components/header';
import Footer from '../../components/footer';
import Input from '../../components/input';
import { useState } from 'react';
import Button from '../../components/button';
import instance from '../../config/axios';
import Router from 'next/router';
import { Icon } from '@iconify/react';

export default function Login() {
    const status = 'guest';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlerEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlerPassword = (e) => {
        setPassword(e.target.value);
    };

    // Handler user login
    const handlerLogin = () =>
        instance
            .post('api/user/login', { email, password })
            .then(() => Router.push('/home'))
            .catch((err) => {
                if (err.response) {
                    return setError(err.response.data.message);
                } else if (err.request) {
                    return setError('Error on requesting data');
                } else {
                    return setError(err.message);
                }
            });

    return (
        <div>
            <Header status={status}></Header>
            <div
                className="flex flex-col justify-center mx-auto my-24 gap-1.5"
                style={{ width: 'fit-content' }}
            >
                {error && (
                    <div
                        className="flex items-center justify-items-start gap-3"
                        style={{
                            width: '500px',
                            height: 'fit-content',
                            borderRadius: '5px',
                            backgroundColor: '#FF4144',
                            padding: '10px 50px 10px 10px',
                        }}
                    >
                        <Icon
                            icon="healthicons:no-outline"
                            color="white"
                            height="30"
                        />
                        <p style={{ fontSize: '14px', color: '#fff' }}>
                            {error}
                        </p>
                    </div>
                )}
                <div
                    className="flex justify-center p-7 mx-auto"
                    style={{
                        border: '2px solid #CB2D6F',
                        width: 'fit-content',
                        height: 'fit-content',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 5px 0px #000000',
                    }}
                >
                    <div className="flex flex-col gap-y-7">
                        <h1 className="text-3xl font-semibold">Login</h1>

                        <div className=" flex flex-col gap-y-5">
                            <Input
                                type="text"
                                placeholder="Email"
                                label="Email"
                                id="name"
                                value={email}
                                onChange={handlerEmail}
                                required
                            ></Input>

                            <div className="flex flex-col gap-y-1.5">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    label="Password"
                                    id="password"
                                    value={password}
                                    onChange={handlerPassword}
                                    required
                                ></Input>
                                <a
                                    style={{
                                        color: '#14A098',
                                        fontSize: '12px',
                                    }}
                                    href="#"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-1.5 text-center">
                            <Button
                                onClick={handlerLogin}
                                size="large"
                                state="primary"
                                color="magenta"
                            >
                                Login
                            </Button>
                            <p style={{ fontSize: '12px' }}>
                                Don’t have a account?{' '}
                                <a
                                    style={{ color: '#14A098' }}
                                    href="/auth/register"
                                >
                                    Register here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

// Ketika user sudah terautentikasi redirect langsung ke home
export const getServerSideProps = async (context) => {
    try {
        const { req, res } = context;
        const token = req.cookies.JSESSIONID;
        await instance.get('/api/user', {
            headers: {
                Cookie: 'JSESSIONID=' + token,
            },
        });

        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    } catch (err) {
        return {
            props: {},
        };
    }
};
