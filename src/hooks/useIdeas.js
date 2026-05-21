import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

export function useIdeas(user) {
  const [ideas, setIdeas] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIdeas([]);
      setFolders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = user.uid;

    // Suscribirse a carpetas
    const foldersQuery = query(
      collection(db, 'folders'),
      where('userId', '==', userId)
    );

    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const foldersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Si no hay carpetas, crear la carpeta General por defecto
      if (foldersData.length === 0) {
        addFolder('General', userId);
      } else {
        setFolders(foldersData);
        // Si no hay carpeta activa o la activa ya no existe, poner la primera
        if (!foldersData.find(f => f.id === activeFolderId)) {
          setActiveFolderId(foldersData[0].id);
        }
      }
    }, (error) => {
      console.error("Error en el listener de carpetas:", error);
      setLoading(false);
    });

    // Suscribirse a ideas
    const ideasQuery = query(
      collection(db, 'ideas'),
      where('userId', '==', userId)
    );

    const unsubscribeIdeas = onSnapshot(ideasQuery, (snapshot) => {
      const ideasData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convertir firestore timestamp a ISO string si existe
          createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
        }))
        // Ordenar por fecha de creación descendente (cliente)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
      setIdeas(ideasData);
      setLoading(false);
    }, (error) => {
      console.error("Error en el listener de ideas:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeFolders();
      unsubscribeIdeas();
    };
  }, [user]); // Removido activeFolderId de dependencias para evitar subscripciones innecesarias

  const addIdea = async (idea) => {
    if (!user) throw new Error('No hay usuario autenticado');
    const docData = {
      ...idea,
      userId: user.uid,
      completed: false,
      createdAt: serverTimestamp(),
    };
    console.log('[addIdea] Intentando guardar en Firestore:', docData);
    try {
      const ref = await addDoc(collection(db, 'ideas'), docData);
      console.log('[addIdea] ✅ Guardado con ID:', ref.id);
    } catch (error) {
      console.error('[addIdea] ❌ Error de Firestore:', error.code, error.message);
      throw error;
    }
  };

  const updateIdea = async (id, updates) => {
    try {
      const ideaRef = doc(db, 'ideas', id);
      await updateDoc(ideaRef, updates);
    } catch (error) {
      console.error("Error updating idea: ", error);
    }
  };

  const deleteIdea = async (id) => {
    try {
      await deleteDoc(doc(db, 'ideas', id));
    } catch (error) {
      console.error("Error deleting idea: ", error);
    }
  };

  const addFolder = async (name, forcedUserId) => {
    const userId = forcedUserId || user?.uid;
    if (!userId) throw new Error('No hay usuario autenticado');
    const docData = { name, userId, icon: 'Folder', createdAt: serverTimestamp() };
    console.log('[addFolder] Intentando guardar en Firestore:', docData);
    try {
      const ref = await addDoc(collection(db, 'folders'), docData);
      console.log('[addFolder] ✅ Guardado con ID:', ref.id);
    } catch (error) {
      console.error('[addFolder] ❌ Error de Firestore:', error.code, error.message);
      throw error;
    }
  };

  const deleteFolder = async (id) => {
    try {
      // Nota: En una app real también deberías decidir qué hacer con las ideas de esa carpeta
      await deleteDoc(doc(db, 'folders', id));
    } catch (error) {
      console.error("Error deleting folder: ", error);
    }
  };

  const renameFolder = async (id, newName) => {
    try {
      await updateDoc(doc(db, 'folders', id), { name: newName });
    } catch (error) {
      console.error("Error renaming folder: ", error);
    }
  };

  return {
    ideas,
    folders,
    activeFolderId,
    setActiveFolderId,
    addIdea,
    updateIdea,
    deleteIdea,
    addFolder,
    deleteFolder,
    renameFolder,
    loading
  };
}
