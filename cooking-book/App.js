import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';

import bdd from './bdd.json';


// Page components
function MainPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Main Page</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Crée ta recette')}
      >
        <Text>Create Recipe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Voir tes recettes')}
      >
        <Text>View Recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

function CreateRecepies() {
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredient, setRecipeIngredient] = useState('');
  const [recipeQuantity, setRecipeQuantity] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [stepsList, setStepsList] = useState([]);
  const [recipeStep, setRecipeStep] = useState('');

  const handleRecipeCreate = () => {
    // Create a new recipe object with the captured details
    const newRecipe = {
      name: recipeName,
      ingredients: ingredientsList.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
      })),
      //steps is an array of strings
      steps: stepsList.map((step) => step.step),
    };
    console.log(newRecipe);
    // Add the new recipe to the existing recipes array
    bdd.recettes.push(newRecipe);

    // Reset the form fields
    setRecipeName('');
    setRecipeIngredient('');
    setRecipeQuantity('');
    setIngredientsList([]);
    setStepsList([]);

    // Navigate to the desired page or perform any other action
    // ...
  };

  const handleAddIngredient = () => {
    setModalVisible(true);
  };

  const handleAddStep = () => {
    setStepModalVisible(true);
  };

  const handleModalConfirm = () => {
    if (recipeIngredient.trim() !== '' && recipeQuantity.trim() !== '') {
      const ingredient = {
        name: recipeIngredient,
        quantity: recipeQuantity,
      };
      setIngredientsList((prevIngredients) => [...prevIngredients, ingredient]);
      setRecipeIngredient('');
      setRecipeQuantity('');
      setModalVisible(false);
    }
  };

  const handleModalConfirmStep = () => {
    if (recipeStep.trim() !== '') {
      const step = {
        step: recipeStep,
      };
      setStepsList((prevSteps) => [...prevSteps, step]);
      setRecipeStep('');
      setStepModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setRecipeIngredient('');
    setRecipeQuantity('');
    setModalVisible(false);
  };

  const handleModalCancelStep = () => {
    setRecipeStep('');
    setStepModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>Crée recette</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddIngredient}>
        <Text>Add Ingredient</Text>
      </TouchableOpacity>
      {ingredientsList.map((ingredient, index) => (
        <Text key={index}>
          {ingredient.name} - {ingredient.quantity}
        </Text>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAddStep}>
        <Text>Add Step</Text>
      </TouchableOpacity>
      {stepsList.map((step, index) => (
        <Text key={index}>{step.step}</Text>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRecipeCreate}>
        <Text>Create Recipe</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Add Ingredient</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingredient"
              value={recipeIngredient}
              onChangeText={setRecipeIngredient}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={recipeQuantity}
              onChangeText={setRecipeQuantity}
            />
            <TouchableOpacity style={styles.button} onPress={handleModalConfirm}>
              <Text>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleModalCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={stepModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Add Step</Text>
            <TextInput
              style={styles.input}
              placeholder="Step"
              value={recipeStep}
              onChangeText={setRecipeStep}
            />
            <TouchableOpacity style={styles.button} onPress={handleModalConfirmStep}>
              <Text>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleModalCancelStep}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function RecipeDetails() {
  const route = useRoute();
  const { recipe } = route.params;
  const handleDownload = async () => {
    const fileName = `${recipe.name}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(recipe));
      console.log('Recipe file downloaded:', fileName);
    } catch (error) {
      console.log('Error downloading recipe file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.recetteName}>{recipe.name}</Text>
      <Text>Liste des ingrédients</Text>
      {
        //keys = name, quantity
        recipe.ingredients.map((ingredient, index) => (
          <Text key={index}>{ingredient.name} : {ingredient.quantity}</Text>
        ))
      }
      <Text>Liste des étapes</Text>
      {
        //keys = step
        recipe.steps.map((step, index) => (
          <Text key={index}>{step}</Text>
        ))
      }
      <TouchableOpacity onPress={handleDownload}>
        <Text>Download</Text>
      </TouchableOpacity>
    </View>
  );
}

function SeeRecepies() {
  const navigation = useNavigation();

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails',{ recipe: recipe });
  };

  const renderRecettes = bdd.recettes.map((recette, index) => (
    <View key={index} style={styles.recetteContainer}>
      <TouchableOpacity onPress={() => handleRecipePress(recette)}>
        <Text style={styles.recetteName}>{recette.name}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text>Liste recettes</Text>
      {renderRecettes}
    </View>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="Crée ta recette" component={CreateRecepies} />
        <Stack.Screen name="Voir tes recettes" component={SeeRecepies} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  recetteContainer: {
    marginBottom: 10,
  },
  recetteName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond semi-transparente
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
});