import "./TextField.scss"

type Props = {
  onChange: (value: string) => void,
  value: string,
  type?: string,
  className?: string
}

export default function TextField(props: Props) {
  const {onChange, value, className, type} = Object.assign({type: "text", className: ""}, props)

  return <input type={type} value={value} className={`text-field ${className}`} onChange={e => onChange(e.target.value)}/>
}