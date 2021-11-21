import { useState } from 'react';
import style from './styles.module.css';

export default function Filter({}) {
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
    });

    const resetFilter = (e) => {
        setCheck({
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
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold pb-2">Filter</h1>
            <div className="flex items-center py-1.5">
                <label htmlFor="1" className={`${style.container}`}>
                    Organization name
                    <input
                        onClick={() => setCheck({ ...Check, cb1: !Check.cb1 })}
                        type="checkbox"
                        id="1"
                        checked={Check.cb1}
                    />{' '}
                    <span className={`${style.checkmark}`}></span>
                </label>
            </div>
            <div className="flex items-center py-1.5">
                <label htmlFor="2" className={`${style.container}`}>
                    Event name
                    <input
                        onClick={() => setCheck({ ...Check, cb2: !Check.cb2 })}
                        type="checkbox"
                        id="2"
                        checked={Check.cb2}
                    />{' '}
                    <span className={`${style.checkmark}`}></span>
                </label>
            </div>
            <div className="flex items-center py-1.5">
                <label htmlFor="3" className={`${style.container}`}>
                    Upcoming event
                    <input
                        onClick={() => setCheck({ ...Check, cb3: !Check.cb3 })}
                        type="checkbox"
                        id="3"
                        checked={Check.cb3}
                    />{' '}
                    <span className={`${style.checkmark}`}></span>
                </label>
            </div>
            <p className="text-xl pb-2">Category</p>
            <div className="ml-8">
                <div className="flex items-center py-1.5">
                    <label htmlFor="4" className={`${style.container}`}>
                        Webinar
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb4: !Check.cb4 })
                            }
                            type="checkbox"
                            id="4"
                            checked={Check.cb4}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="5" className={`${style.container}`}>
                        Seminar
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb5: !Check.cb5 })
                            }
                            type="checkbox"
                            id="5"
                            checked={Check.cb5}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="6" className={`${style.container}`}>
                        Lomba
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb6: !Check.cb6 })
                            }
                            type="checkbox"
                            id="6"
                            checked={Check.cb6}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="7" className={`${style.container}`}>
                        Workshop
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb7: !Check.cb7 })
                            }
                            type="checkbox"
                            id="7"
                            checked={Check.cb7}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="8" className={`${style.container}`}>
                        Sosialisasi
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb8: !Check.cb8 })
                            }
                            type="checkbox"
                            id="8"
                            checked={Check.cb8}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="9" className={`${style.container}`}>
                        Online
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb9: !Check.cb9 })
                            }
                            type="checkbox"
                            id="9"
                            checked={Check.cb9}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
                <div className="flex items-center py-1.5">
                    <label htmlFor="10" className={`${style.container}`}>
                        Offline
                        <input
                            onClick={() =>
                                setCheck({ ...Check, cb10: !Check.cb10 })
                            }
                            type="checkbox"
                            id="10"
                            checked={Check.cb10}
                        />{' '}
                        <span className={`${style.checkmark}`}></span>
                    </label>
                </div>
            </div>
            <button
                onClick={(e) => resetFilter(e)}
                type="reset"
                className={`${style.clear}`}
            >
                Clear Filter
            </button>
        </div>
    );
}
