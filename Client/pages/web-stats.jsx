import Header from '../components/header';
import Footer from '../components/footer';
import instance from '../config/axios';
import { Icon } from '@iconify/react';

export default function WebStats({ user }) {
    const onlineUsers = 19;
    const rating = 0;
    const events = 21;
    const users = 50;
    const registered = 12;

    return (
        <div>
            <Header status={user ? user.role : 'guest'} user={user} />
            <div className="flex flex-col m-24 gap-8">
                <p
                    style={{
                        fontSize: '48px',
                        textAlign: 'center',
                        borderBottom: '2px solid #ABABAB',
                    }}
                >
                    Web Stats
                </p>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between">
                        <div
                            className="flex flex-col gap-2.5"
                            style={{
                                width: '300px',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px', color: '#14A098' }}>
                                Active users
                            </p>
                            <p style={{ fontSize: '36px' }}>{onlineUsers}</p>
                        </div>
                        <div
                            className="flex flex-col gap-2.5"
                            style={{
                                width: '300px',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px', color: '#14A098' }}>
                                Rating
                            </p>
                            <p
                                className="flex items-center gap-1.5"
                                style={{ fontSize: '36px', color: '#ABABAB' }}
                            >
                                {rating} / 5.0
                                <Icon
                                    icon="ant-design:star-filled"
                                    color="#ffc700"
                                    height="45"
                                />
                            </p>
                        </div>
                        <div
                            className="flex flex-col gap-2.5"
                            style={{
                                width: '300px',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px', color: '#14A098' }}>
                                Open Events
                            </p>
                            <p style={{ fontSize: '36px' }}>{events}</p>
                        </div>
                        <div
                            className="flex flex-col gap-2.5"
                            style={{
                                width: '300px',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px', color: '#14A098' }}>
                                Registered Users
                            </p>
                            <p style={{ fontSize: '36px' }}>{users}</p>
                        </div>
                    </div>
                    <div className="flex justify-around gap-12">
                        <div
                            style={{
                                width: '100%',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px' }}>
                                Most Used Categories
                            </p>
                            <div className="flex gap-3">
                                <p
                                    style={{
                                        width: 'fit-content',
                                        fontSize: '20px',
                                        padding: '0px 7px',
                                        boxShadow:
                                            '0px 0px 4px rgba(0, 0, 0, 0.25)',
                                        borderRadius: '5px',
                                    }}
                                >
                                    Webinar
                                </p>
                                <p
                                    style={{
                                        width: 'fit-content',
                                        fontSize: '20px',
                                        padding: '0px 7px',
                                        boxShadow:
                                            '0px 0px 4px rgba(0, 0, 0, 0.25)',
                                        borderRadius: '5px',
                                    }}
                                >
                                    Workshop
                                </p>
                                <p
                                    style={{
                                        width: 'fit-content',
                                        fontSize: '20px',
                                        padding: '0px 7px',
                                        boxShadow:
                                            '0px 0px 4px rgba(0, 0, 0, 0.25)',
                                        borderRadius: '5px',
                                    }}
                                >
                                    Online
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                width: '500px',
                                height: '150px',
                                border: '2px solid #14A098',
                                borderRadius: '5px',
                                padding: '25px',
                            }}
                        >
                            <p style={{ fontSize: '24px' }}>Goal</p>
                            <div className="relative pt-2">
                                <div
                                    style={{
                                        width: '440px',
                                        height: '20px',
                                        background: '#FFF',
                                        border: '1px solid #14A098',
                                        borderRadius: '30px',
                                        position: 'relative',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        width: '220px',
                                        height: '20px',
                                        background: '#14A098',
                                        borderRadius: '30px',
                                        position: 'relative',
                                        top: '-20px',
                                    }}
                                ></div>
                            </div>
                            <p style={{ fontSize: '20px' }}>
                                +
                                <span style={{ color: '#14A098' }}>
                                    {registered}
                                </span>{' '}
                                user registered
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
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
