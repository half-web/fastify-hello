import Link from 'next/link';

export default function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <div className="spacer"></div>
                <div className="right">
                    <Link href="/home">
                        <span>Home</span>
                    </Link>
                    <Link href="/about">
                        <span>About Us</span>
                    </Link>
                    <a href="/post">
                        <span>Blog Post</span>
                    </a>
                </div>
            </nav>
        </header>
    );
}
