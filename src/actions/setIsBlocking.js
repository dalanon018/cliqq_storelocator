export const SET_IS_BLOCKING = 'SET_IS_BLOCKING';

export function setIsBlockingTrue(val) {
    return {
        type: SET_IS_BLOCKING,
        payload: val
    }
}