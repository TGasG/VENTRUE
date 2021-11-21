import Header from '../../components/header';
import Footer from '../../components/footer';
import Input from '../../components/input';
import { useState } from 'react';
import Button from '../../components/button';
import InputDropdown from '../../components/inputDropdown';
import instance from '../../config/axios';
import Router from 'next/router';
import { Icon } from '@iconify/react';

export default function Register({ listFaculty }) {
    const status = 'guest';
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [NIM, setNIM] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [faculty, setFaculty] = useState(0);

    const handlerEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlerFullname = (e) => {
        setFullname(e.target.value);
    };

    const handlerNIM = (e) => {
        setNIM(e.target.value);
    };

    const handlerPassword = (e) => {
        setPassword(e.target.value);
    };
    const handlerConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlerRegister = () =>
        instance
            .post('/api/user/register', {
                email,
                name: fullname,
                nim: NIM,
                password,
                repeatPassword: confirmPassword,
                facultyId: faculty,
                role: 'user',
            })
            .then(() => Router.push('/auth/login'))
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
                    className="flex justify-center p-7"
                    style={{
                        border: '2px solid #CB2D6F',
                        width: 'fit-content',
                        height: 'fit-content',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 5px 0px #000000',
                    }}
                >
                    <div className="flex flex-col gap-y-7">
                        <h1 className="text-3xl font-semibold">Register</h1>

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

                            <Input
                                type="text"
                                placeholder="Fullname"
                                label="Fullname"
                                id="fullname"
                                value={fullname}
                                onChange={handlerFullname}
                                required
                            ></Input>

                            <Input
                                type="text"
                                placeholder="NIM"
                                label="NIM"
                                id="nim"
                                value={NIM}
                                onChange={handlerNIM}
                                required
                            ></Input>

                            <Input
                                type="password"
                                placeholder="Password"
                                label="Password"
                                id="password"
                                value={password}
                                onChange={handlerPassword}
                                required
                            ></Input>

                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                label="Confirm Password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={handlerConfirmPassword}
                                required
                            ></Input>

                            <InputDropdown
                                setSelect={setFaculty}
                                options={listFaculty}
                                placeholder="Faculty"
                                label="Faculty"
                                id="faculty"
                                required
                            ></InputDropdown>
                        </div>

                        <div className="flex flex-col gap-y-1.5 text-center">
                            <Button
                                onClick={handlerRegister}
                                size="large"
                                state="primary"
                                color="magenta"
                                href=""
                            >
                                Register
                            </Button>
                            <p style={{ fontSize: '12px' }}>
                                Already have a account?{' '}
                                <a
                                    style={{ color: '#14A098' }}
                                    href="/auth/login"
                                >
                                    Login here
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

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    const token = req.cookies.JSESSIONID;

    // Check apakah user sudah terautentikasi
    const user = await instance
        .get('/api/user', {
            headers: {
                Cookie: 'JSESSIONID=' + token,
            },
        })
        .catch(() => {
            return;
        });

    if (user)
        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };

    const faculty = await instance.get('/api/faculty');

    return {
        props: {
            listFaculty: faculty.data,
        },
    };
};
