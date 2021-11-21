import Header from '../components/header';
import Footer from '../components/footer';
import instance from '../config/axios';
import { useState } from 'react';

export default function LandingPage({ user }) {
    return (
        <div>
            <Header status={user ? user.role : 'guest'} user={user}></Header>

            <div>
                <p className=" flex justify-center m-24 text-4xl text-center">
                    Event & Information
                </p>
                <div className="flex justify-center m-24 gap-12 flex-wrap">
                    <div
                        style={{
                            width: 380,
                            height: 'fit-content',
                            border: '1px solid #C4C4C4',
                            borderRadius: '5px',
                        }}
                    >
                        <img
                            src="/images/content-home.png"
                            alt="Event picture"
                        />
                        <div className="p-5">
                            <p className="text-base font-semibold">
                                Sosialisasi SN-SBMPTN-UTBK Tahun 2020
                            </p>
                            <p className="text-sm">23-24 Juni 2021</p>
                        </div>
                    </div>

                    <div
                        style={{
                            width: 380,
                            height: 'fit-content',
                            border: '1px solid #C4C4C4',
                            borderRadius: '5px',
                        }}
                    >
                        <img
                            src="/images/content-home.png"
                            alt="Event picture"
                        />
                        <div className="p-5">
                            <p className="text-base font-semibold">
                                Sosialisasi SN-SBMPTN-UTBK Tahun 2020
                            </p>
                            <p className="text-sm">23-24 Juni 2021</p>
                        </div>
                    </div>

                    <div
                        style={{
                            width: 380,
                            height: 'fit-content',
                            border: '1px solid #C4C4C4',
                            borderRadius: '5px',
                        }}
                    >
                        <img
                            src="/images/content-home.png"
                            alt="Event picture"
                        />
                        <div className="p-5">
                            <p className="text-base font-semibold">
                                Sosialisasi SN-SBMPTN-UTBK Tahun 2020
                            </p>
                            <p className="text-sm">23-24 Juni 2021</p>
                        </div>
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

        return {
            props: {
                user: user.data,
            },
        };
    } catch (err) {
        return {
            props: {},
        };
    }
};
