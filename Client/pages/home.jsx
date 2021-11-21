import Header from '../components/header';
import SearchBar from '../components/searchBar';
import Footer from '../components/footer';
import Filter from '../components/filter';
import Content from '../components/content';
import instance from '../config/axios';

export default function Home({ user }) {
    let status;
    if (user) {
        status = user.role;
    } else {
        status = 'guest';
    }

    return (
        <div>
            <Header status={status} user={user}></Header>
            <div
                className="flex flex-col justify-center mx-auto my-7 gap-1.5"
                style={{ width: 'fit-content' }}
            >
                <div className="flex flex-col mx-24 my-7 gap-y-12">
                    <SearchBar />
                    <div className="flex justify-between">
                        <Filter></Filter>
                        <div
                            className="flex flex-wrap gap-y-12 gap-x-7"
                            style={{ width: 960 }}
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
                                // ormawaPage
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
                                // ormawaPage
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
                                // ormawaPage
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
                                // ormawaPage
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
                                // ormawaPage
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
                                // ormawaPage
                            >
                                3
                            </Content>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
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
