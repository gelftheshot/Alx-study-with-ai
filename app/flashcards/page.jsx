'use client';

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'



const Flashcard = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>
  }

  useEffect(() => {
    const createUserAndFlashcards = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.id)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          // Add any initial user data here
          createdAt: new Date()
        })
      }

      const flashcardsRef = collection(userRef, 'flashcards')
      // Note: Collections are created automatically when you add documents to them,
      // so we don't need to explicitly create the flashcards collection.

      // Optionally, create a sample flashcard if needed
      // const newFlashcardRef = doc(flashcardsRef)
      // await setDoc(newFlashcardRef, {
      //   question: 'Sample question',
      //   answer: 'Sample answer',
      //   createdAt: new Date()
      // })
    }

    createUserAndFlashcards()
  }, [user])

  return (
    <div>{user.id}</div>
  )
}

export default Flashcard