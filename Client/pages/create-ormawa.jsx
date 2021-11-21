import Header from '../components/header';
import Footer from '../components/footer';
import Input from '../components/input';
import { useState } from 'react';
import Button from '../components/button';
import InputDropdown from '../components/inputDropdown';
import instance from '../config/axios';
import Router from 'next/router';
import { Icon } from '@iconify/react';

export default function CreateOrmawa({ listFaculty, user }) {
    const status = user.role;
    const [email, setEmail] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFaculty, setIsFaculty] = useState(false);
    const [faculty, setFaculty] = useState(0);
    const [level, setLevel] = useState('');
    const [error, setError] = useState('');

    const listLevel = [
        { name: 'University', id: 'University' },
        { name: 'Faculty', id: 'Faculty' },
    ];

    const handlerEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlerOrganizationName = (e) => {
        setOrganizationName(e.target.value);
    };

    const handleChange = (e) => {
        if (level !== 'University') {
            setIsFaculty(true);
        } else {
            setIsFaculty(false);
        }
    };

    const handlerPassword = (e) => {
        setPassword(e.target.value);
    };
    const handlerConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlerSubmit = async () =>
        await instance
            .post('/api/user/register', {
                name: organizationName,
                email: email,
                password: password,
                repeatPassword: confirmPassword,
                role: 'organization',
                facultyId: faculty,
                level: level.toLowerCase(),
                description: 'No description',
            })
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
            <Header status={status} user={user}></Header>
            <div
                className="flex flex-col justify-center mx-auto my-24 gap-1.5"
                style={{ width: '500px', height: 'fit-content' }}
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
                        <h1 className="text-3xl font-semibold">
                            Create Ormawa
                        </h1>

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
                                placeholder="Organization Name"
                                label="Organization Name"
                                id="orgname"
                                value={organizationName}
                                onChange={handlerOrganizationName}
                                required
                            ></Input>

                            <InputDropdown
                                setSelect={setLevel}
                                onChange={handleChange}
                                options={listLevel}
                                placeholder="Level"
                                label="Level"
                                Id="level"
                            ></InputDropdown>

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
                                level={level}
                                setSelect={setFaculty}
                                options={listFaculty}
                                placeholder="Faculty"
                                label="Faculty"
                                Id="faculty"
                                required
                                notActive={!isFaculty}
                            ></InputDropdown>
                        </div>

                        <Button
                            size="large"
                            state="primary"
                            color="magenta"
                            onClick={handlerSubmit}
                        >
                            Create Ormawa
                        </Button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    try {
        const { req, res } = context;
        const token = req.cookies.JSESSIONID;

        // Check apakah user sudah terautentikasi
        const user = await instance.get('/api/user', {
            headers: {
                Cookie: 'JSESSIONID=' + token,
            },
        });

        // Jika bukan admin redirect ke home
        if (user.data.role !== 'admin')
            throw new Error('Only admin allowed to access this page');

        const faculty = await instance.get('/api/faculty');

        return {
            props: {
                listFaculty: faculty.data,
                user: user.data,
            },
        };
    } catch (err) {
        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    }
};
