import Link from 'next/link';
import Style from '../assets/css/header.module.scss';

export default function Header() {
    return (
        <header className={Style.header}>
            <nav className={Style.nav}>
                <div className={Style.spacer}></div>
                <div className={Style.right}>
                    <Link href="/home">
                        <span>Home</span>
                    </Link>
                    <Link href="/about">
                        <span>About Us</span>
                    </Link>
                    <Link href="/post/123/comment">
                        <span>Blog Post</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
