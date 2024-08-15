import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function createOrUpdateUser(user) {
  if (!user) return;

  const userRef = doc(db, 'users', user.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new user document
    await setDoc(userRef, {
      email: user.primaryEmailAddress.emailAddress,
      name: user.fullName,
      createdAt: new Date()
    });
  }
  // If user already exists, we don't update anything
}
