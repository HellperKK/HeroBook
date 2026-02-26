import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import { oppositeColorRGB } from '../../../utils/oppositeColorRGB';
import './insertBlockButton.scss';
import { useState } from 'react';
import Button from '../../../components/inputs/button/Button';
import Modal from '../../../components/surfaces/modal/Modal';
import { inserBlockAt } from '../../../store/projectSlice';

type Props = {
  index: number;
};

export default function InsertBlockButton({ index }: Props) {
  const params = useParams();
  const dispatch = useDispatch();
  const {
    pages,
    settings: { format },
  } = useSelector((state: RootState) => state.project);
  const [modalOpen, setModalOpen] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: will allways work
  const page = pages.find((page) => page.id === +params.id!)!;

  const pageColor = page.format?.page ?? format.page;

  return (
    <div>
      <button
        type="button"
        className="insert-block"
        style={{ color: pageColor, backgroundColor: oppositeColorRGB(pageColor) }}
        onClick={() => setModalOpen((open) => !open)}
      >
        +
      </button>
      <Modal title="block selection" onClose={() => setModalOpen(false)} open={modalOpen}>
        <div className="flex flex-row">
          <Button
            onClick={() => {
              dispatch(inserBlockAt({ blockType: 'text', blockPosition: index, pageId: page.id }));
              setModalOpen(false);
            }}
          >
            Text
          </Button>
          <Button
            onClick={() => {
              dispatch(inserBlockAt({ blockType: 'choice', blockPosition: index, pageId: page.id }));
              setModalOpen(false);
            }}
          >
            Choice
          </Button>
        </div>
      </Modal>
    </div>
  );
}
