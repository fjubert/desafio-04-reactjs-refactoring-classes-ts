import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import { FoodData } from '../../pages/Dashboard';

interface ModalEditProps {
  isOpen: boolean,
  setIsOpen: () => void,
  editingFood: FoodData,
  handleUpdateFood: (food: FoodData) => Promise<void>;
}


export function ModalEditFood(props: ModalEditProps) {

  const formRef = useRef(null);

  const handleSubmit = async (data: FoodData) => {

    props.handleUpdateFood(data);
    props.setIsOpen();
  };

    return (
      <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={props.editingFood}>
          <h1>Editar Prato</h1>
          <Input name="image" placeholder="Cole o link aqui" icon={undefined} />

          <Input name="name" placeholder="Ex: Moda Italiana" icon={undefined} />
          <Input name="price" placeholder="Ex: 19.90" icon={undefined} />

          <Input name="description" placeholder="Descrição" icon={undefined} />

          <button type="submit" data-testid="edit-food-button">
            <div className="text">Editar Prato</div>
            <div className="icon">
              <FiCheckSquare size={24} />
            </div>
          </button>
        </Form>
      </Modal>
    );
};

export default ModalEditFood;
