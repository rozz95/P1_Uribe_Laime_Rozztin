import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { db } from '../firebase'; // Importar db
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Importar funciones de Firestore

const HomeScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [comidaFavorita, setComidaFavorita] = useState('');

  // Estados para mostrar los datos guardados después de actualizar
  const [savedNombre, setSavedNombre] = useState('');
  const [savedApellido, setSavedApellido] = useState('');
  const [savedComidaFavorita, setSavedComidaFavorita] = useState('');

  // Cargar los datos del perfil desde Firestore
  useEffect(() => {
    const loadProfile = async () => {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedNombre(data.nombre || '');
        setSavedApellido(data.apellido || '');
        setSavedComidaFavorita(data.comidaFavorita || '');
      }
    };

    loadProfile();
  }, []);

  // Función para actualizar el perfil en Firestore
  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      await setDoc(userRef, {
        nombre: nombre,
        apellido: apellido,
        comidaFavorita: comidaFavorita,
      });
      
      // Después de actualizar, limpiamos los campos de los TextInput
      setNombre('');
      setApellido('');
      setComidaFavorita('');
      
      // También actualizamos los datos mostrados con los datos guardados en Firestore
      setSavedNombre(nombre);
      setSavedApellido(apellido);
      setSavedComidaFavorita(comidaFavorita);
      
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar perfil');
    }
  };

  // Función para cerrar sesión
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      {/* Mostrar el email del usuario autenticado */}
      <Text>Email: {auth.currentUser?.email}</Text>

      {/* Inputs para los datos del perfil */}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Comida Favorita"
        value={comidaFavorita}
        onChangeText={(text) => setComidaFavorita(text)}
        style={styles.input}
      />

      {/* Botón para actualizar el perfil */}
      <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
        <Text style={styles.buttonText}>Actualizar Perfil</Text>
      </TouchableOpacity>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity onPress={handleSignOut} style={styles.buttonOutline}>
        <Text style={styles.buttonOutlineText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Mostrar los datos guardados */}
      <View style={styles.savedDataContainer}>
        <Text style={styles.savedDataText}>Nombre: {savedNombre}</Text>
        <Text style={styles.savedDataText}>Apellido: {savedApellido}</Text>
        <Text style={styles.savedDataText}>Comida Favorita: {savedComidaFavorita}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3872ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#3872ff',
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#3872ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savedDataContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  savedDataText: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default HomeScreen;
