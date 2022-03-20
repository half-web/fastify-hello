import Inception from './inception';
import Style from '../../assets/css/star.module.scss';

export default function RenderCanvas() {
    setTimeout(() => {
        Inception('#inception');
    }, 500);

    return <canvas id="inception" className={Style.starCanvas}></canvas>;
}
