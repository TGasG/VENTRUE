import { Icon } from '@iconify/react';

export default function AddSosmed({}) {
    return (
        <div
            className="flex items-center"
            style={{
                borderRadius: '5px',
                border: '2px solid #14A098',
                width: 'fit-content',
            }}
        >
            <select
                style={{
                    width: '80px',
                    height: '50px',
                    objectFit: 'contain',
                    marginLeft: '2px',
                    border: '0px',
                    outline: '0px',
                }}
                name=""
                id=""
            >
                <option value="">
                    <Icon icon="cib:line" color="white" height="30" />
                </option>
                <option value="">1</option>
            </select>
            <input
                type="text"
                name=""
                id=""
                style={{
                    width: '300px',
                    height: '50px',
                    borderLeft: '2px solid #14A098',
                    outline: 'none',
                    padding: '10px',
                    fontSize: '20px',
                }}
            />
            <button
                style={{
                    backgroundColor: '#14A098',
                    width: '52px',
                    height: '50px',
                    objectFit: 'contain',
                    padding: '11px',
                }}
            >
                <Icon icon="carbon:add-alt" color="white" height="30" />
            </button>
        </div>
    );
}
