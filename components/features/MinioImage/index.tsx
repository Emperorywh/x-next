import Image from "next/image";

interface IProps {
    width: number;
    height: number;
    alt: string;
    objectName: string;
    className?: string;
}

/**
 * 渲染MinIO的图片
 * @param props 
 * @returns 
 */
const MinioImage = (props: IProps) => {
    const { objectName } = props;
    const src = `/api/minio/getSource/${objectName}`
    return <Image
        {...props}
        src={src}
    />
}

export default MinioImage;