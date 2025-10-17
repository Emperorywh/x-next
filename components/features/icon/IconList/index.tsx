import { IconCommonProps } from "../types";

interface IProps extends IconCommonProps {

}

/**
 * 列表
 * @param props 
 * @returns 
 */
export function IconList(props: IProps) {
    const { width = 26, height = 26, className } = props;
    return <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width, height }} className={className}><g><path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path></g></svg>
}