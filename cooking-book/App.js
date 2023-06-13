import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
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
  //const [recipeInstructions, setRecipeInstructions] = useState('');

  const handleRecipeCreate = () => {
    // Create a new recipe object with the captured details
    const newRecipe = {
      name: recipeName,
      //instructions: recipeInstructions,
    };

    // Add the new recipe to the existing recipes array
    bdd.recettes.push(newRecipe);

    // Reset the form fields
    setRecipeName('');
    //setRecipeInstructions('');

    // Navigate to the desired page or perform any other action
    // ...
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
      {/* <TextInput
        style={styles.input}
        placeholder="Recipe Instructions"
        value={recipeInstructions}
        onChangeText={setRecipeInstructions}
        multiline
      /> */}
      <Button title="Create Recipe" onPress={handleRecipeCreate} />
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
      {/* Display other recipe information here */}
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
});