'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');

    try {
      // Test 1: Check if Firebase is initialized
      setStatus('✓ Firebase initialized successfully');
      
      // Test 2: Try to create a test user
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      setStatus('Creating test user...');
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setStatus('✓ Test user created successfully');
      
      // Test 3: Try to write to Firestore
      setStatus('Testing Firestore write...');
      await setDoc(doc(db, 'test', userCredential.user.uid), {
        email: testEmail,
        createdAt: new Date(),
        test: true
      });
      setStatus('✓ Firestore write successful');
      
      // Test 4: Try to sign in with the test user
      setStatus('Testing sign in...');
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      setStatus('✓ All Firebase tests passed! Your configuration is working.');
      
    } catch (error: any) {
      console.error('Firebase test failed:', error);
      setStatus(`❌ Firebase test failed: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testFirebaseConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </Button>
        {status && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            <pre className="whitespace-pre-wrap">{status}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}