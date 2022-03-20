// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import MarkdownIt from 'markdown-it';
import fs from 'fs';
import path from 'path';
type FileInfo = {
    title: string;
    link: string;
};

type StaticProps = {
    posts: FileInfo[];
};

function formateFileInfo(filePath: string) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const lines = fileContents.split('\n').filter((text) => text.trim());
        const title = lines[0].replaceAll('#', '');
        const fileInfo = path.parse(filePath);

        return {
            title,
            link: fileInfo.name,
        };
    } catch (err) {
        return {
            title: '',
            link: '',
        };
    }
}

export async function getServerSideProps(): Promise<{ props: StaticProps }> {
    const postsDirectory = path.join(process.cwd(), 'public/files');
    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
        .map((filename) => {
            const filePath = path.join(postsDirectory, filename);

            return formateFileInfo(filePath);
        })
        .filter((item) => item.link);

    return {
        props: {
            posts,
        },
    };
}

export default function PostList({ posts }: StaticProps) {
    return (
        <div className="post-view">
            <div className="post-list">
                {(posts || []).map((post) => (
                    <a className="post-item" href={`post/${post.link}`}>
                        <div>{post.title}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
