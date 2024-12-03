import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/editor/1");
  })
  return <div></div>
}