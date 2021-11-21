import Header from '../../components/header';
import Footer from '../../components/footer';
import { Icon } from '@iconify/react';
import Button from '../../components/button';

export default function DetailEvent({ user }) {
    const status = user.role;
    let butonTittle;

    if (status === 'admin') {
        butonTittle = 'Edit Event';
    } else {
        butonTittle = 'Register Event';
    }

    return (
        <div>
            <Header status={status} user={user}></Header>
            <div className="flex justify-around mx-24 my-12 gap-8">
                <div
                    style={{ width: '700px' }}
                    className="flex flex-col gap-y-7"
                >
                    <img src="/images/event-image.png" alt="Event image" />
                    <div className="flex flex-col gap-y-2.5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">
                                Play it real, make with Unreal!
                            </h1>
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center gap-1.5">
                                    <Icon
                                        icon="akar-icons:person"
                                        color="black"
                                        height="24"
                                    />
                                    <p>12</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon
                                        icon="akar-icons:eye"
                                        color="black"
                                        height="24"
                                    />
                                    <p>36</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-semibold">KSM Multimedia</p>
                        <p className="text-xl text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Tincidunt in donec at magnis aliquam et sed
                            etiam. Est, aliquam commodo dictum nulla. Odio purus
                            amet bibendum justo vitae gravida posuere sit dui.
                            Maecenas orci, scelerisque adipiscing consequat
                            egestas. Mattis quis consequat, duis id velit
                            condimentum.
                        </p>
                    </div>
                </div>
                <div style={{ width: '440px' }} className="flex flex-col gap-7">
                    <div className="flex items center justify-between">
                        <h1 className="text-3xl	font-semibold">Event detail</h1>
                        <div className="flex items-center gap-2.5">
                            {status === 'user' && (
                                <button>
                                    <Icon
                                        icon="akar-icons:heart"
                                        color="black"
                                        height="24"
                                    />
                                </button>
                            )}
                            <button>
                                <Icon
                                    icon="ant-design:share-alt-outlined"
                                    color="black"
                                    height="24"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Icon
                                    icon="clarity:dollar-bill-line"
                                    color="black"
                                    height="40"
                                />
                                <p>Fee</p>
                            </div>
                            <p>Price</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Icon
                                    icon="fontisto:date"
                                    color="black"
                                    height="40"
                                />
                                <p>Register Closed</p>
                            </div>
                            <p>Friday, 29-10-2021</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Icon
                                    icon="fontisto:date"
                                    color="black"
                                    height="40"
                                />
                                <p>Event start</p>
                            </div>
                            <p>Friday, 29-10-2021</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Icon
                                    icon="bx:bx-detail"
                                    color="black"
                                    height="40"
                                />
                                <p>Type</p>
                            </div>
                            <p>Workshop</p>
                        </div>
                    </div>
                    <Button
                        children={butonTittle}
                        size="large"
                        state="primary"
                        color="magenta"
                        href=""
                    ></Button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
