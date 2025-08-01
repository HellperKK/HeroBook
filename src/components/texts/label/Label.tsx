import "./label.scss"

type Props = {
    children: string,
    width?: string
}

export default function Label({children, width}:Props) {
    const style = {width: width ?? "auto"}
    return <span style={style} className="label">{children}</span>
}