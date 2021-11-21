import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import Input from '../../components/input';
import { useRef, useState } from 'react';
import Type from '../../components/type';
import instance from '../../config/axios';
import Router from 'next/router';
import { Icon } from '@iconify/react';

export default function CreateEvent({ user, categories }) {
    const [evName, setEvName] = useState('');
    const [evDesc, setEvDesc] = useState('');
    const [fee, setFee] = useState('');
    const [dateReg, setDateReg] = useState('');
    const [evDate, setEvDate] = useState('');
    const [banner, setBanner] = useState('/images/def-banner.png');
    const [showButton, setShowButton] = useState(false);
    const [error, setError] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const inputBannerRef = useRef(null);
    const status = user.role;
    const count = 0;

    const handlerEventName = (e) => {
        setEvName(e.target.value);
    };

    const handlerEventDesc = (e) => {
        setEvDesc(e.target.value);
    };

    const handlerFee = (e) => {
        setFee(e.target.value);
    };

    const handlerDateReg = (e) => {
        setDateReg(e.target.value);
    };

    const handlerEvDate = (e) => {
        setEvDate(e.target.value);
    };

    const handlerRegLink = (e) => {
        setRegLink(e.target.value);
    };

    const handleChangeBanner = () => {
        const reader = new FileReader();
        setShowButton(true);
        reader.onload = () => {
            if (reader.readyState === 2) {
                setBanner(reader.result);
            }
        };

        reader.readAsDataURL(inputBannerRef.current.files[0]);
    };

    const handleDeleteImage = () => {
        const reader = new FileReader();
        if (typeof banner === Array) {
            setBanner[count] = null;
            count++;
            reader.readAsDataURL(inputBannerRef.current.files[count + 1]);
        }
    };

    const handlerCreate = async () => {
        try {
            const event = await instance.post('/api/organization/events', {
                name: evName,
                description: evDesc,
                time: evDate,
                registerEnd: dateReg,
                price: fee,
                categories: categoryId,
            });

            const eventId = event.data.data.id;
            const formData = new FormData();
            formData.append('images', banner ? banner : null);

            const imageRes = await instance.post(
                `/api/organization/events/${eventId}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log(imageRes);

            return Router.push('/home');
        } catch (err) {
            if (err.response) {
                return setError(err.response.data.message);
            } else if (err.request) {
                return setError('Error on requesting data');
            } else {
                return setError(err.message);
            }
        }
    };

    // const onFileUpload = () => {
    // Create an object of formData
    // const formData = new FormData();
    // // Update the formData object
    // formData.append(
    //     'myFile',
    //     this.state.selectedFile,
    //     this.state.selectedFile.name
    // );
    // // Details of the uploaded file
    // console.log(this.state.selectedFile);
    // // Request made to the backend api
    // // Send formData object
    // axios.post('api/uploadfile', formData);
    // };

    return (
        <div>
            <Header status={status} user={user} />
            <div className="flex justify-around mx-24 my-12 gap-8">
                <div
                    style={{ width: '700px' }}
                    className="flex flex-col gap-y-5"
                >
                    <div>
                        <label htmlFor="banner">
                            <img
                                src={banner}
                                alt="default banner"
                                className="object-cover"
                                required
                            />
                        </label>
                        {showButton && (
                            <button
                                onClick={handleDeleteImage()}
                                style={{
                                    width: '300px',
                                    fontSize: '24px',
                                    color: '#fff',
                                    backgroundColor: '#FF4144',
                                    height: '50px',
                                    borderRadius: '5px',
                                }}
                            >
                                Delete image
                            </button>
                        )}
                        <input
                            ref={inputBannerRef}
                            onChange={handleChangeBanner}
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                            type="file"
                            name="files"
                            id="banner"
                            multiple
                        />
                    </div>
                    <Input
                        type="text"
                        value={evName}
                        placeholder="Event name"
                        label="Event name"
                        onChange={handlerEventName}
                        required
                    ></Input>
                    <Input
                        type="textArea"
                        value={evDesc}
                        placeholder="Event Description"
                        label="Description"
                        onChange={handlerEventDesc}
                        required
                    ></Input>
                </div>
                <div className="flex flex-col gap-7">
                    <h1 className="text-3xl	font-semibold">Creating Event</h1>
                    {error && (
                        <div
                            className="flex items-center justify-items-start gap-3"
                            style={{
                                width: '440px',
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
                    <div className="flex flex-col gap-2.5">
                        <Input
                            type="text"
                            value={fee}
                            placeholder="Fee (Rupiah)"
                            label="Fee"
                            onChange={handlerFee}
                            required
                        ></Input>
                        <Type
                            setCategoryId={setCategoryId}
                            options={categories}
                        />
                        <Input
                            type="datetime-local"
                            value={dateReg}
                            placeholder="Date of the register will be closed"
                            label="Date register"
                            onChange={handlerDateReg}
                            required
                        ></Input>
                        <Input
                            type="datetime-local"
                            value={evDate}
                            label="Date event"
                            placeholder="Date of the event will be held"
                            onChange={handlerEvDate}
                            required
                        ></Input>
                    </div>
                    <Button
                        onClick={handlerCreate}
                        size="large"
                        state="primary"
                        color="magenta"
                    >
                        Register
                    </Button>
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
        if (user.data.role !== 'organization')
            throw new Error('Only Ormawa allowed to access this page');

        // Dapetkan data category
        const categories = await instance.get('/api/category', {
            headers: {
                Cookie: 'JSESSIONID=' + token,
            },
        });

        return {
            props: {
                user: user.data,
                categories: categories.data.data,
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
