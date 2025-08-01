import "./textArea.scss"

type Props = {
  onChange: (value: string) => void
  value: string
  className?: string
}

export default function TextArea( {onChange, value, className}: Props) {

  return <textarea spellCheck="false" className={`text-area ${className ?? ""}`} value={value} onChange={e => onChange(e.target.value)}/>
}