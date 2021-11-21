import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import Content from '../../components/content';

export default function Profile({}) {
    const status = 'user';
    let isOrmawaPage = false;
    const regEvent = 169;

    if (status === 'ormawa') {
        isOrmawaPage = true;
    }

    return (
        <div>
            <Header status={status} />
            <div className="m-24 justify-around">
                <div className="flex gap-40">
                    <img
                        style={{ width: '350px', height: '350px' }}
                        className="rounded-full avatar-frame"
                        src="/images/profile-image.png"
                        alt="profile picture"
                    />
                    <div className="flex flex-col gap-5 justify-between">
                        {status === 'user' && (
                            <div className="flex gap-20 text-2xl">
                                <div className="flex flex-col gap-5">
                                    <p>Full name</p>
                                    <p>Email</p>
                                    <p>NIM</p>
                                    <p>Faculty</p>
                                    <p>Event registered</p>
                                    <p>Social media</p>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <p>Sarjana Anekdot</p>
                                    <p>Nganekdot@gmail.com</p>
                                    <p>1910511069</p>
                                    <p>Computer Science</p>
                                    <p>{regEvent}</p>
                                    {/* <p>ini tempat icon sosmed</p> */}
                                </div>
                            </div>
                        )}
                        {status === 'ormawa' && (
                            <div className="flex gap-20 text-2xl">
                                <div className="flex flex-col gap-5">
                                    <p>Organization name</p>
                                    <p>Email</p>
                                    <p>Level</p>
                                    {/* <p>Faculty</p> */}
                                    <p>Social media</p>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <p>KSM Multimedia</p>
                                    <p>Multimedia@gmail.com</p>
                                    <p>University</p>
                                    {/* <p>Computer Science</p> */}
                                    <p>{regEvent}</p>
                                    {/* <p>ini tempat icon sosmed</p> */}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-40">
                            <Button
                                children="Edit Profile"
                                size="medium"
                                state="secondary"
                                color="lightGreen"
                                href="/users/edit"
                            ></Button>
                            <button
                                style={{
                                    width: '300px',
                                    fontSize: '24px',
                                    color: '#fff',
                                    backgroundColor: '#FF4144',
                                    height: '50px',
                                    borderRadius: '5px',
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-2xl flex justify-around border-b-2 my-12 items-center">
                        <p className="border-b-2 border-black p-3">
                            Event History
                        </p>
                        <p>Wishlist</p>
                    </div>
                    <div
                        className="flex flex-wrap gap-y-7 gap-x-12 m-auto"
                        style={{ width: '1000px' }}
                    >
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                        <Content
                            orgName="KSM Multimedia"
                            orgImg="/images/profile-image.png"
                            evName="Play it real, make with Unreal"
                            evDate="23-24 Juni 2021"
                            evImg="/images/event-image.png"
                            type="workshop"
                            status={status}
                            registered={12}
                            view={36}
                            price={0}
                            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            ormawaPage={isOrmawaPage}
                        >
                            3
                        </Content>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
