import style from './styles.module.css';

export default function Input({
    type,
    required,
    placeholder,
    label,
    value,
    notActive,
    id,
    onChange,
}) {
    let borderColor;

    if (notActive) {
        borderColor = style.notActive;
    } else {
        borderColor = style.active;
    }

    if (type === 'text' || type === 'datetime-local') {
        return (
            <div>
                <label htmlFor={id} className={`${style.label}`}>
                    {label}
                </label>
                <br />
                <input
                    type={type}
                    maxLength="30"
                    id={id}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={notActive}
                    className={`${style.input} ${style.small} ${borderColor}`}
                />
            </div>
        );
    } else if (type === 'textArea') {
        return (
            <div>
                <label htmlFor={id} className={`${style.label}`}>
                    {label}
                </label>
                <br />
                <textarea
                    type={type}
                    id={id}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={notActive}
                    className={`${style.input} ${style.large} ${borderColor}`}
                />
            </div>
        );
    } else if (type === 'password') {
        return (
            <div>
                <label htmlFor={id} className={`${style.label}`}>
                    {label}
                </label>
                <br />
                <input
                    type={type}
                    id={id}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={notActive}
                    className={`${style.input} ${style.small} ${borderColor}`}
                />
            </div>
        );
    }
}
