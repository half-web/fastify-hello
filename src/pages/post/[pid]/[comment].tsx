import { useRouter } from 'next/router';

export default function Comment() {
    const router = useRouter();

    const { pid, comment } = router.query;

    return (
        <div>
            <div>Pid: {pid}</div>
            <div>Comment: {comment}</div>
        </div>
    );
}
