import { Code } from '../common/const/code';

export default function success(data = {}) {
    return {
        code: Code.OK,
        data,
    };
}
