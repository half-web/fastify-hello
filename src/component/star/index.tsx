import StarrySky from './animation';
import Style from '../../assets/css/star.module.scss';

export default function RenderCanvas() {
    setTimeout(() => {
        new StarrySky('star-canvas');
    }, 500);

    return <canvas id="star-canvas" className={Style.starCanvas}></canvas>;
}
