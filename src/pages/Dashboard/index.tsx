import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodData {
  id: number,
  name: string,
  description: string,
  price: number,
  available: true,
  image: string,
}

interface State {
  foods: FoodData[],
  editingFood: FoodData,
  modalOpen: boolean,
  editModalOpen: boolean,
}

export function Dashboard() {
  const [state, setState] = useState<State>({
    foods: [],
    editingFood: {} as FoodData,
    modalOpen: false,
    editModalOpen: false,
  });
  
  useEffect(() => {
    api.get('foods')
    .then(response => setState({ ...state, foods: response.data }))
  }, []);

  const handleAddFood = async (food: FoodData) => {
    const { foods } = state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setState({ ...state, foods: [...foods, response.data], modalOpen: false });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodData) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `foods/${editingFood.id}`,
        { editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({ ...state, foods: foodsUpdated, editModalOpen: false });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    const { foods } = state;

    await api.delete(`foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setState({ ...state,foods: foodsFiltered });
  }

  const toggleModal = () => {
    const { modalOpen } = state;

    setState({...state ,modalOpen: !modalOpen });
  }

  const toggleEditModal = () => {
    const { editModalOpen } = state;

    setState({...state,editModalOpen: !editModalOpen });
  }

  const handleEditFood = (food: FoodData) => {
    setState({ ...state, editingFood: food, editModalOpen: true });
  }
  
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={state.modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={state.editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={state.editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {state.foods &&
            state.foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    )
};

export default Dashboard;
