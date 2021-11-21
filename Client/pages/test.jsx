import Button from '../components/button';
import Filter from '../components/filter';
import Footer from '../components/footer';
import Header from '../components/header';
import SearchBar from '../components/searchBar';
import Input from '../components/input';
import Content from '../components/content';
import { useState } from 'react';
import InputDropdown from '../components/inputDropdown';
import AddSosmed from '../components/addSosmed';
import Type from '../components/type';

export default function Test() {
    const [name, setname] = useState('test');

    const handlerName = (e) => {
        setname(e.target.value);
    };

    const faculty = [
        { Value: 'flavor', Label: 'flavor' },
        { Value: 'yummy', Label: 'yummy' },
        { Value: 'red', Label: 'red' },
        { Value: 'green', Label: 'green' },
        { Value: 'yellow', Label: 'yellow' },
    ];

    return (
        <div>
            <Header status="admin"></Header>
            <AddSosmed />
            <Content
                orgName="KSM Multimedia"
                orgImg="/images/profile-image.png"
                evName="Play it real, make with Unreal"
                evDate="23-24 Juni 2021"
                evImg="/images/event-image.png"
                type="workshop"
                status="admin"
                registered={12}
                view={36}
                price={0}
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                // ormawaPage
            >
                3
            </Content>

            <Button size="medium" state="primary" color="magenta">
                Login
            </Button>

            <SearchBar></SearchBar>

            <Filter />

            <Input
                type="text"
                placeholder="Name"
                label="Name"
                id="name"
                value={name}
                onChange={handlerName}
            ></Input>

            <Type />

            <InputDropdown
                options={faculty}
                placeholder="faculty"
                label="Faculty"
                id="faculty"
                // notActive
            ></InputDropdown>

            <Footer></Footer>
        </div>
    );
}
