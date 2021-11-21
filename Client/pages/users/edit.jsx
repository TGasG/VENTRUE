import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/button';
import Input from '../../components/input';
import { useRef, useState } from 'react';
import InputDropdown from '../../components/inputDropdown';

export default function EditProfile() {
    const status = 'admin';
    let isAdmin = false;
    const inputAvatarRef = useRef(null);

    if (status === 'admin') {
        isAdmin = true;
    }

    const [avatar, setAvatar] = useState('/images/profile-image.png');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [NIM, setNIM] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFaculty, setIsFaculty] = useState(false);

    const faculty = [
        { Value: 'FEB', Label: 'FEB' },
        { Value: 'FK', Label: 'FK' },
        { Value: 'FISIP', Label: 'FISIP' },
        { Value: 'FIK', Label: 'FIK' },
        { Value: 'FH', Label: 'FH' },
        { Value: 'FIKES', Label: 'FIKES' },
        { Value: 'FT', Label: 'FT' },
    ];

    const level = [
        { Value: 'University', Label: 'University' },
        { Value: 'Faculty', Label: 'Faculty' },
    ];

    const handlerEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlerFullname = (e) => {
        setFullname(e.target.value);
    };

    const handlerNIM = (e) => {
        setNIM(e.target.value);
    };

    const handlerOrganizationName = (e) => {
        setOrganizationName(e.target.value);
    };

    const handlerOldPassword = (e) => {
        setOldPassword(e.target.value);
    };

    const handlerNewPassword = (e) => {
        setNewPassword(e.target.value);
    };
    const handlerConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleChange = (e) => {
        if (e.target.value !== 'University') {
            setIsFaculty(true);
        } else {
            setIsFaculty(false);
        }
    };

    const handleChangeAvatar = () => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(inputAvatarRef.current.files[0]);
    };

    return (
        <div>
            <Header status={status} />
            <div className="flex flex-col mx-24 my-7 gap-y-12">
                <div>
                    <h1 className="text-4xl font-bold">Edit Profile</h1>
                    <div className="h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex gap-24 justify-around">
                    <div className="flex flex-col gap-7">
                        <img
                            className="w-72 h-72 rounded-full avatar-frame object-cover"
                            src={avatar}
                            alt="profile picture"
                        />
                        <label
                            htmlFor="profile-picture"
                            style={{
                                width: '300px',
                                height: '50px',
                                borderRadius: '5px',
                                border: '2px solid #CB2D6F',
                                fontSize: '24px',
                                color: '#CB2D6F',
                                cursor: 'pointer',
                                textAlign: 'center',
                                lineHeight: '180%',
                            }}
                        >
                            Choose a photo
                            <input
                                accept="image/png, image/jpeg, image/jpg"
                                ref={inputAvatarRef}
                                onChange={handleChangeAvatar}
                                type="file"
                                id="profile-picture"
                                style={{ display: 'none' }}
                            />
                        </label>
                        <div>{/* yg social media */}</div>
                    </div>
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-5">
                            <h1 className="text-3xl font-semibold">
                                Edit Info
                            </h1>
                            {status === 'user' && (
                                <div className="flex flex-col gap-5">
                                    <Input
                                        type="text"
                                        label="Email"
                                        value={email}
                                        placeholder="Nganekdot@gmail.com"
                                        onChange={handlerEmail}
                                        notActive
                                    ></Input>
                                    <Input
                                        type="text"
                                        label="Fullname"
                                        value={fullname}
                                        placeholder="Fullname"
                                        onChange={handlerFullname}
                                        required
                                    ></Input>
                                    <Input
                                        type="text"
                                        label="NIM"
                                        value={NIM}
                                        placeholder="NIM"
                                        onChange={handlerNIM}
                                        required
                                    ></Input>
                                    <InputDropdown
                                        options={faculty}
                                        placeholder="Faculty"
                                        label="Faculty"
                                        id="faculty"
                                        required
                                    ></InputDropdown>
                                </div>
                            )}
                            {status !== 'user' && (
                                <div className="flex flex-col gap-5">
                                    <Input
                                        type="text"
                                        label="Email"
                                        value={email}
                                        placeholder="Nganekdot@gmail.com"
                                        onChange={handlerEmail}
                                        notActive
                                    ></Input>
                                    <InputDropdown
                                        onChange={handleChange}
                                        options={level}
                                        placeholder="Level"
                                        label="Level"
                                        id="level"
                                        notActive={!isAdmin}
                                    ></InputDropdown>
                                    <Input
                                        type="text"
                                        label="Organization name"
                                        value={organizationName}
                                        placeholder="Organization name"
                                        onChange={handlerOrganizationName}
                                        required
                                    ></Input>
                                    <InputDropdown
                                        options={faculty}
                                        placeholder="Faculty"
                                        label="Faculty"
                                        id="faculty"
                                        required
                                        notActive={!isFaculty}
                                    ></InputDropdown>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-5">
                            <h1 className="text-3xl font-semibold">
                                Edit Password
                            </h1>
                            <Input
                                type="password"
                                label="Old password"
                                value={oldPassword}
                                placeholder="oldPassword"
                                onChange={handlerOldPassword}
                                required
                            ></Input>
                            <Input
                                type="password"
                                label="New Password"
                                value={newPassword}
                                placeholder="New password"
                                onChange={handlerNewPassword}
                                required
                            ></Input>
                            <Input
                                type="password"
                                label="Confirm password"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                onChange={handlerConfirmPassword}
                                required
                            ></Input>
                        </div>
                        <Button
                            children="Save profile"
                            size="large"
                            state="primary"
                            color="lightGreen"
                            href=""
                        ></Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
