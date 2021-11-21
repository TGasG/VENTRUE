import Multiselect from 'multiselect-react-dropdown';
import style from './styles.module.css';

export default function Type({ options, setCategoryId }) {
    return (
        <div>
            <label className={`${style.label}`} htmlFor="type">
                Type
            </label>
            <Multiselect
                isObject={false}
                // options={[
                //     'Webinar',
                //     'Seminar',
                //     'Lomba',
                //     'Sosialisasi',
                //     'Workshop',
                //     'Online',
                //     'Offline',
                // ]}
                onSelect={(selects) => {
                    const selected = [];
                    selects.forEach((select) => {
                        selected.push(
                            options.find((opt) => opt.name === select)
                        );
                    });

                    return setCategoryId(selected.map(({ id, name }) => id));
                }}
                options={options.map((opt) => opt.name)}
                id="type"
                style={{
                    multiselectContainer: {
                        width: '440px',
                        height: 'fit-content',
                        border: '2px solid #14A098',
                        borderRadius: '5px',
                    },
                    searchBox: {
                        height: 'fit-content',
                        'font-size': '20px',
                        border: 'none',
                    },
                    chips: {
                        background: '#14A098',
                    },
                    optionContainer: {
                        color: '#14A098',
                    },
                }}
                placeholder="Type of event"
            />
        </div>
    );
}
