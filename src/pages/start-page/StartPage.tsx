import { useNavigate } from 'react-router-dom';
import Button from '../../components/inputs/button/Button';
import GridLayout from '../../components/layout/gridLayout/GridLayout';
import Separator from '../../components/misc/separator/Separator';
import Label from '../../components/texts/label/Label';
import Text from '../../components/texts/text/Text';
import './startPage.scss';

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="start-page">
      <GridLayout columns={2} rows={1} className="start-page-grid">
        <div className="start-page-section">
          <Label width="100%">Create</Label>
          <Text>Start a new adventure or continue your work.</Text>
          <Button className="button-width" onClick={() => navigate('/new')}>
            Start a new project
          </Button>
          <Button className="button-width" onClick={() => navigate('/editor/open')}>
            Open a project
          </Button>
        </div>
        <div className="start-page-section">
          <Label width="100%">Play</Label>
          <Text>Jump into your story and play.</Text>
          <Button className="button-width" onClick={() => navigate('/play/open')}>
            Play a project
          </Button>
        </div>
      </GridLayout>
    </div>
  );
}
