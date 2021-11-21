import style from './styles.module.css';
import { Icon } from '@iconify/react';

export default function InputDropdown({
    options,
    placeholder,
    label,
    Id,
    required,
    setSelect,
    level,
}) {
    let borderColor;

    if (level !== 'Faculty' && Id === 'faculty') {
        borderColor = style.notActive;
    } else {
        borderColor = style.active;
    }

    return (
        <div>
            <label htmlFor={Id} className={`${style.label}`}>
                {label}
            </label>
            <div className={`${style.wrapper} relative`}>
                <select
                    id={Id}
                    onChange={(e) => setSelect(e.target.value)}
                    required={required}
                    className={`relative ${style.input} ${borderColor}`}
                    disabled={level !== 'Faculty' && Id === 'faculty'}
                >
                    <option value={null} selected disabled>
                        {placeholder}
                    </option>
                    {options.map(({ name, id }, index) => (
                        <option value={id} id={id}>
                            {name}
                        </option>
                    ))}
                </select>
                {!(level !== 'Faculty' && Id === 'faculty') && (
                    <label htmlFor={Id} className="absolute right-0 top-0 m-3">
                        <Icon
                            icon="akar-icons:chevron-down"
                            color="black"
                            height="24"
                        />
                    </label>
                )}
            </div>
        </div>
    );
}
