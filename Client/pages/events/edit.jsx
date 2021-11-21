import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import Input from '../../components/input';
import { useState } from 'react';
import Type from '../../components/type';

export default function EditEvent({ user }) {
    const [evName, setEvName] = useState('');
    const [evDesc, setEvDesc] = useState('');
    const [fee, setFee] = useState('');
    const [dateReg, setDateReg] = useState('');
    const [evDate, setEvDate] = useState('');
    const [regLink, setRegLink] = useState('');
    const [file, setFile] = useState('/images/def-banner.png');
    const status = user.role;

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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
                            <img src={file} alt="default banner" required />
                        </label>
                        <input
                            onChange={handleFileChange}
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
                    <h1 className="text-3xl	font-semibold">Editing Event</h1>
                    <div className="flex flex-col gap-2.5">
                        <Input
                            type="text"
                            value={fee}
                            placeholder="Fee (Rupiah)"
                            label="Fee"
                            onChange={handlerFee}
                            required
                        ></Input>
                        <Type />
                        <Input
                            type="text"
                            value={dateReg}
                            placeholder="Date of the register will be closed"
                            label="Date register"
                            onChange={handlerDateReg}
                            required
                        ></Input>
                        <Input
                            type="text"
                            value={evDate}
                            label="Date event"
                            placeholder="Date of the event will be held"
                            onChange={handlerEvDate}
                            required
                        ></Input>
                        <Input
                            type="text"
                            value={regLink}
                            label="Register link"
                            placeholder="Register link"
                            onChange={handlerRegLink}
                            required
                        ></Input>
                    </div>
                    <Button
                        children="Update"
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
