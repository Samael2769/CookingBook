import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';

var bdd = {
  recettes: [
  ],
}

const resetBddFile = async () => {
  try {
    const fileUri = `${FileSystem.documentDirectory}bdd.json`;
    await FileSystem.deleteAsync(fileUri);
    console.log('bdd.json file deleted successfully');

    // Create a new empty bdd.json file
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ recettes: [] }));
    console.log('bdd.json file created successfully');
  } catch (error) {
    console.log('Error resetting bdd.json file:', error);
  }
};

const loadBdd = async () => {
  try {
    const fileUri = `${FileSystem.documentDirectory}bdd.json`;
    const fileContents = await FileSystem.readAsStringAsync(fileUri);
    const parsedBdd = JSON.parse(fileContents);
    console.log('Bdd loaded:', parsedBdd);
    bdd = parsedBdd;
  } catch (error) {
    console.log('Error reading data from file:', error);
  }
};

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

  const handleRecipeCreate = async () => {
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
    //resetBddFile();
    // Add the new recipe to the existing recipes array
    //bdd.recettes.push(newRecipe);
      
    // Read the existing data from the file
    let existingData = { recettes: [] };
    try {
      const fileUri = `${FileSystem.documentDirectory}bdd.json`;
      const fileContents = await FileSystem.readAsStringAsync(fileUri);
      existingData = JSON.parse(fileContents);
    } catch (error) {
      // File does not exist or failed to read, handle the error
      console.log('Error reading data from file:', error);
    }

    // Add the new recipe to the existing data
    existingData.recettes.push(newRecipe);

    // Write the updated data back to the file
    try {
      const fileUri = `${FileSystem.documentDirectory}bdd.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData));
      console.log('Recipe saved successfully');
    } catch (error) {
      console.log('Error writing data to file:', error);
    }

    // Reset the form fields
    setRecipeName('');
    setRecipeIngredient('');
    setRecipeQuantity('');
    setIngredientsList([]);
    setStepsList([]);

    loadBdd();
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
    <View style={styles.creationRecetteContainer}>
      <Text style={styles.title}>Créer recette</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de la recette"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <View style={styles.CreationRecetteAddContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddIngredient}>
          <Text style={styles.buttonText}>Add Ingredient</Text>
        </TouchableOpacity>
        <View style={styles.ingredientsListContainer}>
          <ScrollView contentContainerStyle={styles.ingredientsList}>
            {ingredientsList.map((ingredient, index) => (
              <Text key={index}>
                {ingredient.name} - {ingredient.quantity}
              </Text>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddStep}>
          <Text style={styles.buttonText}>Add Step</Text>
        </TouchableOpacity>
        <View style={styles.ingredientsListContainer}>
          <ScrollView contentContainerStyle={styles.ingredientsList}>
            {stepsList.map((step, index) => (
              <Text key={index}>{step.step}</Text>
            ))}
          </ScrollView>
        </View>
        <View style={styles.CreationRecetteAddContainerCreate}>
          <TouchableOpacity style={styles.button} onPress={handleRecipeCreate}>
            <Text style={styles.buttonText}>Create Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Ingredient</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingredient"
              value={recipeIngredient}
              onChangeText={setRecipeIngredient}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Quantity"
              value={recipeQuantity}
              onChangeText={setRecipeQuantity}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleModalConfirm}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={stepModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Step</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Step"
              value={recipeStep}
              onChangeText={setRecipeStep}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleModalConfirmStep}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalCancelStep}>
              <Text style={styles.modalButtonText}>Cancel</Text>
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

  useEffect(() => {
    loadBdd();
  }, []);

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
  useEffect(() => {
    loadBdd();
  }, []);
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
    marginTop: -20,
    padding: 8,
    backgroundColor: 'darkgrey',
    borderRadius: 5,
    width: 250, // Adjust the value to your desired width
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: 'orange',
  },
  modalContent: {
    backgroundColor: '#FF6F00',
    padding: 20,
    borderRadius: 20,
  },
  modalInput: {
    height: 50,
    width: 250,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    fontSize: 17,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    width: 250, // Adjust the value to your desired width
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  creationRecetteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  CreationRecetteAddContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    top: 10,
  },
  CreationRecetteAddContainerCreate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  ingredientsList: {
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 90,
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    fontSize: 20,
    borderWidth: 3,
    padding: 10,
    marginTop: 20,
  },
  ingredientsListContainer: {
    height: '20%',
    width: 250,
    marginTop: 0,
    marginBottom: 20,
  },
  
});