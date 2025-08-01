import "./text.scss"

type Props = {
    children: string
}

export default function Text({children}:Props) {
    return <p className="text">{children}</p>
}