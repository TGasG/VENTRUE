import style from './styles.module.css';
import { Icon } from '@iconify/react';

export default function Footer({}) {
    return (
        <footer className={`${style.footer}`}>
            <div className={style.top}>
                <div>
                    <h1 className={style.title}>VenTrue</h1>
                    <p className={style.desc}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                </div>
                <div>
                    <h1 className={style.title}>Contents</h1>
                    <ul className={style.desc}>
                        <li>Content 1</li>
                        <li>Content 2</li>
                        <li>Content 3</li>
                    </ul>
                </div>
                <div>
                    <h1 className={style.title}>Social</h1>
                    <div className="flex items-center gap-5">
                        <a href="">
                            <Icon icon="akar-icons:youtube-fill" height="80" />
                        </a>
                        <a href="">
                            <Icon
                                icon="akar-icons:instagram-fill"
                                height="53"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className={`${style.down}`}>
                <p>Copyright © 2021 SQUIDTIVATION • All rights reserved.</p>
            </div>
        </footer>
    );
}
