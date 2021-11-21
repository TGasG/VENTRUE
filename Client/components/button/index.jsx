import style from './styles.module.css';

export default function Button({
    children,
    size,
    state,
    color,
    notActive,
    href,
    onClick,
}) {
    const testClick = () => {
        alert('yap');
    };
    let sizeButton;
    let colorButton;

    if (size === 'large') {
        sizeButton = style.large;
    } else if (size === 'medium') {
        sizeButton = style.medium;
    } else if (size === 'small') {
        sizeButton = style.small;
    }

    if (state === 'primary') {
        if (color === 'magenta') {
            colorButton = style['primary-magenta'];
        } else if (color === 'lightGreen') {
            colorButton = style['primary-lightGreen'];
        }
    } else if (state === 'secondary') {
        if (color === 'magenta') {
            colorButton = style['secondary-magenta'];
        } else if (color === 'lightGreen') {
            colorButton = style['secondary-lightGreen'];
        }
    }

    if (notActive && state === 'primary') {
        colorButton = style['primary-not-active'];
    } else if (notActive && state === 'secondary') {
        colorButton = style['secondary-not-active'];
    }

    if (href) {
        return (
            <a
                className={`flex items-center justify-center ${colorButton} ${sizeButton}`}
                href={href}
                onClick={onClick}
            >
                {children}{' '}
            </a>
        );
    } else {
        return (
            <button
                onClick={onClick}
                className={`${colorButton} ${sizeButton} cursor-default`}
                disabled={notActive}
            >
                {' '}
                {children}
            </button>
        );
    }
}
