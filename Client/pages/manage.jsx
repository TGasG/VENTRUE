import { useState } from 'react';
import Button from '../components/button';
import Footer from '../components/footer';
import Header from '../components/header';
import SearchBar from '../components/searchBar';
import style from './styles.module.css';

export default function Manage({ user }) {
    const status = user.role;

    const [Check, setCheck] = useState({
        cb1: false,
        cb2: false,
        cb3: false,
        cb4: false,
        cb5: false,
        cb6: false,
        cb7: false,
        cb8: false,
        cb9: false,
        cb10: false,
        cb11: false,
        cb12: false,
        selAll: false,
    });

    const selectAll = (e) => {
        setCheck({
            cb1: !Check.selAll,
            cb2: !Check.selAll,
            cb3: !Check.selAll,
            cb4: !Check.selAll,
            cb5: !Check.selAll,
            cb6: !Check.selAll,
            cb7: !Check.selAll,
            cb8: !Check.selAll,
            cb9: !Check.selAll,
            cb10: !Check.selAll,
            cb11: !Check.selAll,
            cb12: !Check.selAll,
            selAll: !Check.selAll,
        });
    };

    return (
        <div>
            <Header status={status} user={user} />
            <div className="flex flex-col mx-24 gap-7">
                <div className="text-2xl flex justify-around border-b-2 my-12 items-center">
                    <p className="border-b-2 border-black p-3">
                        Event management
                    </p>
                    <p>User management</p>
                </div>
                <SearchBar />
                <button
                    onClick={''}
                    style={{
                        width: '300px',
                        fontSize: '24px',
                        color: '#fff',
                        backgroundColor: '#FF4144',
                        height: '50px',
                        borderRadius: '5px',
                    }}
                >
                    Delete data
                </button>
                <table>
                    <tr
                        className="text-base w-full text-white"
                        style={{
                            backgroundColor: '#0F292F',
                            border: '2px solid #0F292F',
                            borderCollapse: 'collapse',
                        }}
                    >
                        <th>
                            <div className="flex items-center py-1.5">
                                <label
                                    htmlFor="selectAll"
                                    className={`${style.container}`}
                                >
                                    Select all
                                    <input
                                        onClick={(e) => selectAll(e)}
                                        type="checkbox"
                                        id="selectAll"
                                        checked={Check.selAll}
                                    />{' '}
                                    <span
                                        className={`${style.checkmark}`}
                                    ></span>
                                </label>
                            </div>
                        </th>
                        <th>Organization</th>
                        <th>Event name</th>
                        <th>Type</th>
                        <th>Option</th>
                    </tr>
                    <tr>
                        <td>
                            <div className="flex items-center py-1.5">
                                <label
                                    htmlFor="1"
                                    className={`${style.container}`}
                                >
                                    <input
                                        onClick={() =>
                                            setCheck({
                                                ...Check,
                                                cb1: !Check.cb1,
                                            })
                                        }
                                        type="checkbox"
                                        id="1"
                                        checked={Check.cb1}
                                    />{' '}
                                    <span
                                        className={`${style.checkmark}`}
                                    ></span>
                                </label>
                            </div>
                        </td>
                        <td>KSM Multimedia</td>
                        <td>Play it real, make with unreal!</td>
                        <td>Workshop</td>
                        <td className="flex gap-2.5 justify-center border-none">
                            <Button
                                children="Edit"
                                size="small"
                                state="secondary"
                                color="lightGreen"
                                href="/events/edit"
                            ></Button>
                            <button
                                style={{
                                    width: '100px',
                                    fontSize: '16px',
                                    color: '#fff',
                                    backgroundColor: '#FF4144',
                                    height: '30px',
                                    borderRadius: '5px',
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="flex items-center py-1.5">
                                <label
                                    htmlFor="2"
                                    className={`${style.container}`}
                                >
                                    <input
                                        onClick={() =>
                                            setCheck({
                                                ...Check,
                                                cb2: !Check.cb2,
                                            })
                                        }
                                        type="checkbox"
                                        id="2"
                                        checked={Check.cb2}
                                    />{' '}
                                    <span
                                        className={`${style.checkmark}`}
                                    ></span>
                                </label>
                            </div>
                        </td>
                        <td>KSM Multimedia</td>
                        <td>Play it real, make with unreal!</td>
                        <td>Workshop</td>
                        <td className="flex gap-2.5 justify-center border-none">
                            <Button
                                children="Edit"
                                size="small"
                                state="secondary"
                                color="lightGreen"
                                href="/events/edit"
                            ></Button>
                            <button
                                style={{
                                    width: '100px',
                                    fontSize: '16px',
                                    color: '#fff',
                                    backgroundColor: '#FF4144',
                                    height: '30px',
                                    borderRadius: '5px',
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <Footer />
        </div>
    );
}
