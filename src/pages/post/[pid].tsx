// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import fs from 'fs';
import path from 'path';

export async function getServerSideProps(context: { query: { pid: string } }) {
    try {
        const { pid } = context.query;
        const filename = path.join(process.cwd(), 'public/files', `${pid}.md`);
        const fileContents = fs.readFileSync(filename, 'utf8');
        const md = MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
        });
        const content = md.render(fileContents);

        return {
            props: {
                content,
            },
        };
    } catch (err) {
        return {
            props: {
                content: '文章找不到了',
            },
        };
    }
}

export default function PostContent({ content }: { content: string }) {
    return (
        <div className="post-view">
            <div className="post-content">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
}
