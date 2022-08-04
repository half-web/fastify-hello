import Header from '../component/header';
// import Star from '../component/star';
// import Inception from '../component/inception';
import Bouncy from '../component/bouncy';
import type { AppProps /*, AppContext */ } from 'next/app';
import Head from 'next/head';
import '../assets/css/app.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>半瓶web醋</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <script src="/js/wasm_exec.js"></script>
            </Head>
            <Bouncy></Bouncy>
            <Header></Header>
            <div className="main-view">
                <Component {...pageProps} />
            </div>
            <div className="__beian__">
                <span>www.halfweb.site 2022 @ All rights Reserved</span>
                <a href="https://beian.miit.gov.cn/" target="_blank">
                    京ICP备2022005705号-1
                </a>
            </div>
        </div>
    );
}
