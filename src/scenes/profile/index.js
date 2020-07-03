import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import Firebase from '~/services/Firebase';
import { Spacing } from '~/styles';
import ProfileLinks from './components/profileLinks';
import ProfileDetails from './components/profileDetails';
import LocationModal from './components/locationModal';

const styles = StyleSheet.create({
  container: {
    margin: Spacing.medium,
  },
});

const Profile = () => {
  const [isLocationModalOpen, toggleLocationModal] = useState(false);
  const [updateLocation, onLocationInput] = useState('');
  const [user, onUpdateUser] = useState({
    name: '',
    email: '',
    location: '',
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { uid } = Firebase.currentUser();

        if (uid) {
          const userData = await Firebase.getUser(uid);
          onUpdateUser(userData.data());
        }
      } catch (firebaseError) {
        // eslint-disable-next-line
        console.log(firebaseError);
      }
    };
    getUser();
  }, []);

  async function onSubmitLocationChange() {
    try {
      await Firebase.updateUser({
        uid: user.uid,
        location: updateLocation,
      });

      onUpdateUser({
        ...user,
        location: updateLocation,
      });
    } catch (firebaseError) {
      // eslint-disable-next-line
      console.log(firebaseError);
    }
  }

  const { name, email, location } = user;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ zIndex: 0 }}>
        <ProfileDetails name={name} email={email} location={location} />
        <ProfileLinks
          disableOnPress={isLocationModalOpen}
          openModal={() => toggleLocationModal(!isLocationModalOpen)}
        />
      </View>
      {isLocationModalOpen && (
        <LocationModal
          closeModal={() => toggleLocationModal(!isLocationModalOpen)}
          onLocationInput={onLocationInput}
          onSetLocation={onSubmitLocationChange}
          location={updateLocation}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
