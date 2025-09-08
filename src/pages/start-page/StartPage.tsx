import { useNavigate } from "react-router-dom";
import Button from "../../components/inputs/button/Button";
import "./startPage.scss";

export default function StartPage() {
    const navigate = useNavigate();

	return <div className="start-page">
        <Button className="button-width" onClick={() => navigate("/new")}>Start a new project</Button>
        <Button className="button-width" onClick={() => navigate("/open")}>Open a project</Button>
    </div>;
}
