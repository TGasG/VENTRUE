import { Icon } from '@iconify/react';
import style from './styles.module.css';
import Button from '../button';
import { useEffect, useRef, useState } from 'react';
import TrashIcon from '../icons/trash';
import DownloadIcon from '../icons/download';

export default function Content({
    orgName,
    orgImg,
    evName,
    evDate,
    evImg,
    type,
    status,
    registered,
    view,
    price,
    desc,
    ormawaPage,
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    let editable = false;
    const dropdown = useRef(null);

    useEffect(() => {
        if (!showDropdown) return;

        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [showDropdown]);

    if (price === 0) {
        price = 'Free';
    } else {
        price = 'Rp ' + price;
    }

    if (status === 'admin' || status === 'ormawa') {
        editable = true;
    }

    return (
        <div className={`${style.wrapper} relative`}>
            <div className="flex items-center justify-between p-3.5">
                {ormawaPage && (
                    <div>
                        <h1 className="text-base font-bold">{evName}</h1>
                        <p className="text-xs">{evDate}</p>
                    </div>
                )}

                {!ormawaPage && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={orgImg}
                                alt="organization image"
                                className="w-12 -12  rounded-full avatar-frame"
                            />
                            <div>
                                <h1 className="text-base font-bold">
                                    {orgName}
                                </h1>
                                <p className="text-xs">{type}</p>
                            </div>
                        </div>
                    </div>
                )}
                {editable && (
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="cursor-pointer"
                    >
                        <Icon
                            icon="bx:bx-dots-horizontal-rounded"
                            color="#bababa"
                            height="24"
                        />
                        {showDropdown && (
                            <div
                                ref={dropdown}
                                className={`absolute -bottom-100 right-0 ${style.dropdown} z-10`}
                            >
                                <div className="flex items-center p-1 mt-1 hover:bg-gray-200">
                                    <DownloadIcon />
                                    <a className="pl-2.5">Download Data</a>
                                </div>
                                <div className="flex items-center p-1 mb-1 hover:bg-gray-200">
                                    <TrashIcon />
                                    <a className="pl-2.5">Delete</a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="relative">
                <img src={evImg} alt="event image" />
                <div className="flex items-center justify-center absolute bottom-2 right-2 w-max  h-4  text-white bg-gray-200 bg-opacity-50 text-center text-sm rounded-md p-2">
                    <p>{price}</p>
                </div>
            </div>
            <div className="flex justify-between items-center px-2.5 py-1.5">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                        <Icon
                            icon="akar-icons:person"
                            color="black"
                            height="24"
                        />
                        <p>{registered}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Icon icon="akar-icons:eye" color="black" height="24" />
                        <p>{view}</p>
                    </div>
                </div>
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
            {status === 'ormawaPage' && (
                <div className="text-xs px-3">
                    <p className="my-1.5">{type}</p>
                    <p>{desc}</p>
                </div>
            )}
            {status !== 'ormawaPage' && (
                <div className="px-3">
                    <h1 className="text-base font-bold my-1.5">{evName}</h1>
                    <p className="text-xs">{evDate}</p>
                </div>
            )}
            <div className="absolute bottom-0 right-0 m-2.5">
                <Button
                    children="Detail"
                    size="small"
                    state="primary"
                    color="lightGreen"
                    href="/events/detail"
                ></Button>
            </div>
        </div>
    );
}
