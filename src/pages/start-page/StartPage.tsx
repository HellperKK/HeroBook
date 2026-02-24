import { useNavigate } from "react-router-dom";
import Button from "../../components/inputs/button/Button";
import "./startPage.scss";

export default function StartPage() {
    const navigate = useNavigate();

	return <div className="start-page">
        <h2>Create</h2>
        <Button className="button-width" onClick={() => navigate("/new")}>Start a new project</Button>
        <Button className="button-width" onClick={() => navigate("/editor/open")}>Open a project</Button>
        <h2>Play</h2>
        <Button className="button-width" onClick={() => navigate("/play/open")}>Play a project</Button>
    </div>;
}
