import "./toggle.scss"

type Props = {
  checked: boolean,
  onChange: (value: Boolean) => void
}

export default function Toggle({checked, onChange}: Props) {
  return <label className="toggle">
    <input type="checkbox" />
    <span className="toggle-slider"></span>
  </label>
}