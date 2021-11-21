import { Icon } from '@iconify/react';
import style from './styles.module.css';

export default function SearchBar({}) {
    return (
        <label
            htmlFor="search"
            className={`${style.searchBar} flex items-center`}
        >
            <Icon icon="ant-design:search-outlined" className="m-5 w-6 h-6" />
            <input
                type="text"
                placeholder="Search here"
                id="search"
                className="outline-none w-11/12"
            />
        </label>
    );
}
