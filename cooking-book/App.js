import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';

var bdd = {
  recettes: [
    {
      name: 'Pâtes à la carbonara',
      ingredients: [
        {
          name: 'Pâtes',
          quantity: '500g',
        },
        {
          name: 'Lardons',
          quantity: '200g',
        },
        {
          name: 'Crème fraîche',
          quantity: '20cl',
        },
        {
          name: 'Parmesan',
          quantity: '100g',
        },
      ],
      steps: [
        'Faire cuire les pâtes',
        'Faire revenir les lardons',
        'Ajouter la crème fraîche',
        'Ajouter le parmesan',
        'Mélanger le tout',
      ],
    }
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
    loadBdd();
  } catch (error) {
    console.log('Error resetting bdd.json file:', error);
  }
};

const handleDelete = async (recipeName) => {
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

  // Remove the recipe from the existing data
  existingData.recettes = existingData.recettes.filter((recipe) => recipe.name !== recipeName);
  
  // Write the updated data to the file
  try {
    const fileUri = `${FileSystem.documentDirectory}bdd.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData));
    console.log('Data written to file:', existingData);
    loadBdd();
  } catch (error) {
    console.log('Error writing data to file:', error);
  }
};

const handleEdit = async (recipeName, recipeIngredient, recipeQuantity, ingredientsList, stepsList) => {
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

  // Remove the recipe from the existing data
  existingData.recettes = existingData.recettes.filter((recipe) => recipe.name !== recipeName);

  // Add the recipe to the existing data
  existingData.recettes.push({
    name: recipeName,
    ingredients: ingredientsList,
    steps: stepsList,
  });

  // Write the updated data to the file
  try {
    const fileUri = `${FileSystem.documentDirectory}bdd.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(existingData));
    console.log('Data written to file:', existingData);
    loadBdd();
  } catch (error) {
    console.log('Error writing data to file:', error);
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
    <View style={mainPageStyles.container}>
      <Text style={mainPageStyles.title}>Cooking Book</Text>
      <View style={mainPageStyles.buttonContainer}>
        <TouchableOpacity
          style={mainPageStyles.button}
          onPress={() => navigation.navigate('Crée ta recette')}
        >
          <Text style={mainPageStyles.buttonText}>Create Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={mainPageStyles.button}
          onPress={() => navigation.navigate('Voir tes recettes')}
        >
          <Text style={mainPageStyles.buttonText}>See Recipes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const mainPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 100,
    padding: 8,
    backgroundColor: 'grey',
    borderRadius: 20,
    width: 300, // Adjust the value to your desired width
    height: 200,
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 30,
  },
  button: {
    marginTop: 30,
    padding: 8,
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    width: 250, // Adjust the value to your desired width
    height: 50,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

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

  const handleDeleteIngredient = (index) => {
    const newIngredientsList = [...ingredientsList];
    newIngredientsList.splice(index, 1);
    setIngredientsList(newIngredientsList);
  };

  const handleDeleteStep = (index) => {
    const newStepsList = [...stepsList];
    newStepsList.splice(index, 1);
    setStepsList(newStepsList);
  };

  return (
    <View style={createStyles.container}>
      <Text style={createStyles.title}>Créer recette</Text>
      <View style={createStyles.inputContainer}>
      <TextInput
        style={createStyles.input}
        placeholder="Nom de la recette"
        value={recipeName}
        onChangeText={setRecipeName}
        />
      </View>
      <View style={createStyles.creationRecetteAddContainer}>
        <TouchableOpacity style={createStyles.button} onPress={handleAddIngredient}>
          <Text style={createStyles.buttonText}>Add Ingredient</Text>
        </TouchableOpacity>
        <View style={createStyles.ingredientsListContainer}>
          <ScrollView contentContainerStyle={createStyles.ingredientsList}>
            {ingredientsList.map((ingredient, index) => (
              <View key={index} style={createStyles.ingredient}>
                <Text style={createStyles.tabText}>{ingredient.name} - {ingredient.quantity}</Text>
                <TouchableOpacity style={createStyles.deleteButton} onPress={() => handleDeleteIngredient(index)}>
                  <Text style={createStyles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={createStyles.button} onPress={handleAddStep}>
          <Text style={createStyles.buttonText}>Add Step</Text>
        </TouchableOpacity>
        <View style={createStyles.ingredientsListContainer}>
          <ScrollView contentContainerStyle={createStyles.ingredientsList}>
            {stepsList.map((step, index) => (
              <View key={index} style={createStyles.ingredient}>
                <Text style={createStyles.tabText}>{step.step}</Text>
                <TouchableOpacity style={createStyles.deleteButton} onPress={() => handleDeleteStep(index)}>
                  <Text style={createStyles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={createStyles.submitButtonContainer}>
        <TouchableOpacity style={createStyles.submitButton} onPress={handleRecipeCreate}>
          <Text style={createStyles.submitButtonText}>Create Recipe</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={createStyles.modalContainer}>
          <Text style={createStyles.modalTitle}>Add Ingredient</Text>
          <View style={createStyles.modalInputContainer}>
            <TextInput
              style={createStyles.modalInput}
              placeholder="Ingredient"
              value={recipeIngredient}
              onChangeText={setRecipeIngredient}
            />
            <TextInput
              style={createStyles.modalInput}
              placeholder="Quantity"
              value={recipeQuantity}
              onChangeText={setRecipeQuantity}
            />
          </View>
          <View style={createStyles.modalButtonsContainer}>
            <TouchableOpacity style={createStyles.modalButton} onPress={handleModalConfirm}>
              <Text style={createStyles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={createStyles.modalButton} onPress={handleModalCancel}>
              <Text style={createStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={stepModalVisible} animationType="slide">
        <View style={createStyles.modalContainer}>
          <Text style={createStyles.modalTitle}>Add Step</Text>
          <View style={createStyles.modalInputContainer}>
            <TextInput
              style={createStyles.modalInput}
              placeholder="Step"
              value={recipeStep}
              onChangeText={setRecipeStep}
            />
          </View>
          <View style={createStyles.modalButtonsContainer}>
            <TouchableOpacity style={createStyles.modalButton} onPress={handleModalConfirmStep}>
              <Text style={createStyles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={createStyles.modalButton} onPress={handleModalCancelStep}>
              <Text style={createStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 0,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: 'grey',
    borderRadius: 20,
    padding: 20,
    width: 300,
    alignSelf: 'center',
    height: 100,
  },
  input: {
    borderColor: '#000',
    backgroundColor: 'darkgrey',
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
    height: 60,
    fontSize: 20,
  },
  creationRecetteAddContainer: {
    backgroundColor: 'grey',
    marginTop: 30,
    borderRadius: 20,
    padding: 20,
    width: 300,
    alignSelf: 'center',
    height: 300,
  },
  button: {
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ingredientsListContainer: {
    borderRadius: 20,
    width: 300,
    alignSelf: 'center',
    height: 60,
    marginBottom: 20,
  },
  ingredientsList: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 20,
    width: 300,
    height: 300,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderColor: '#000',
    backgroundColor: 'darkgrey',
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
    height: 60,
    width: 250,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    height: 60,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    backgroundColor: 'grey',
    width: 300,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    padding: 20,
  },
  modalInputContainer: {
    backgroundColor: 'grey',
    width: 300,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 50
  },
  submitButtonContainer: {
    borderRadius: 20,
    height: 60,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    height: 60,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    borderRadius: 20,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
  },
});

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
    <View style={detailStyles.container}>
      <Text style={detailStyles.recetteName}>{recipe.name}</Text>
      <View style={detailStyles.ingredientsContainer}>
        <Text style={detailStyles.subTitle}>Ingredients</Text>
        <View style={detailStyles.ingredientsContainerScroll}>
          <ScrollView>
            {
              //keys = name, quantity
              recipe.ingredients.map((ingredient, index) => (
                <Text styles={detailStyles.text} key={index}>{ingredient.name} : {ingredient.quantity}</Text>
                ))
            }
          </ScrollView>
        </View>
      </View>
      <View style={detailStyles.stepsContainer}>
        <Text style={detailStyles.subTitle}>Etapes</Text>
        <View style={detailStyles.stepsContainerScroll}>
          <ScrollView>
            {
              //keys = step
              recipe.steps.map((step, index) => (
                <Text styles={detailStyles.text} key={index}>{step}</Text>
                ))
            }
          </ScrollView>
        </View>
      </View>
      <View style={detailStyles.buttonsContainer}>
        <TouchableOpacity style={detailStyles.button} onPress={handleDownload}>
          <Text style={detailStyles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={detailStyles.button} onPress={() => {handleDelete(recipe.name)}}>
          <Text style={detailStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={detailStyles.button} onPress={handleEdit}>
          <Text style={detailStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  recetteName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
  },
  ingredientsContainer: {
    backgroundColor: 'grey',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: 300,
    alignSelf: 'center',
    height: 200,
    marginTop: 20,
  },
  ingredientsContainerScroll: {
    marginTop: 20,
  },
  stepsContainer: {
    backgroundColor: 'grey',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: 300,
    alignSelf: 'center',
    height: 200,
    marginTop: 20,
  },
  stepsContainerScroll: {
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'darkgrey',
    borderRadius: 20,
    height: 60,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});


function SeeRecepies() {
  const navigation = useNavigation();

  useEffect(() => {
    loadBdd();
  }, []);

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails',{ recipe: recipe });
  };

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.title}>Liste recettes</Text>
      <View style={listStyles.scrollContainer}>
        <ScrollView>
          {
            bdd.recettes.map((recette, index) => (
              <View key={index} style={listStyles.recetteContainer}>
                <TouchableOpacity onPress={() => handleRecipePress(recette)}>
                  <Text style={listStyles.recetteText}>{recette.name}</Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>
      </View>
      <TouchableOpacity onPress={() => resetBddFile()}>
        <Text>Supprimer toute la liste</Text>
      </TouchableOpacity>
    </View>
  );
}

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  scrollContainer: {
    backgroundColor: 'grey',
    width: 300,
    height: 400,
    borderRadius: 20,
  },
  recetteContainer: {
    backgroundColor: 'grey',
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  recetteText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

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