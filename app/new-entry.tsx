// import { colors } from "@/config/theme";
// import { Form } from '@/components/forms';
import { create as createEntry } from '@/features/entries/services/entryService';
import { Entry } from "@/features/entries/types";
import { ImageService } from '@/scripts/image-service';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text, useTheme } from "@rneui/themed";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

export default function NewEntryScreen() {
  const navigation = useNavigation();
	const db = useSQLiteContext();
  const router = useRouter()  
  const { theme } = useTheme()
  const colors = theme.colors
    

	const [body, setBody] = useState("");
	const [title, setTitle] = useState("");
	const [imageUri, setImageUri] = useState("");

	const submitParams = {
        title: title as string,
        body,
        image_uri: imageUri,
        created_at: new Date().toISOString()
	} as Omit<Entry, 'id'>


	async function handleSubmit() {
    if (!title || !body) {
      Alert.alert('Missing Fields', 'Please fill in both the title and body fields before submitting.')
      return
    }
		try {
			const entryId = await createEntry(db, submitParams)
			console.log("ENTRY ID: ", entryId)
            Alert.alert('Entry Added!', 'You added an entry to your food journal. Great job!')
            router.navigate('/')
		} catch (error) {
			console.error(error)
		}
	}

  return(
    <ScrollView style={{ backgroundColor: colors.background, flex: 1 }}>
      <TouchableOpacity style={{ padding: 24 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={36} color={colors.textPrimary}/>
      </TouchableOpacity>
      <View style={{ padding: 32, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 }}>What did you eat today?</Text>
        <Input
          returnKeyType='next'
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginBottom: 16 }}
          inputStyle={{ backgroundColor: 'transparent', borderRadius: 8, paddingHorizontal: 12, color: colors.textPrimary }}
          inputContainerStyle={{ backgroundColor: 'transparent', borderRadius: 8, paddingHorizontal: 12, borderColor: colors.textSecondary, borderWidth: 1 }}
          placeholderTextColor={colors.textSecondary}
          cursorColor={colors.textPrimary}
          selectionHandleColor={colors.textSecondary}
          // underlineColorAndroid={colors.textSecondary}
        />
        <Input
          returnKeyType='next'
          placeholder='Body'
          placeholderTextColor={colors.textSecondary}
          value={body}
          onChangeText={setBody}
          containerStyle={{ marginBottom: 16 }}
          inputStyle={{ backgroundColor: 'transparent', color: colors.textPrimary }}
          inputContainerStyle={{ backgroundColor: '#0000', borderRadius: 8, paddingHorizontal: 12, minHeight: '20%', borderColor: colors.textSecondary, borderWidth: 1 }}
          multiline
          cursorColor={colors.textPrimary}
          selectionHandleColor={colors.textSecondary}
          numberOfLines={4}
        />
        {imageUri ? (
          <>
            <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Selected Image:</Text>
            <Image
              source={imageUri ? { uri: imageUri } : null}
              style={{ width: '100%', height: '25%', borderRadius: 8, marginBottom: 16 }}
              contentFit="scale-down"
            />
          </>
          ) : (
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>No image selected</Text>
        )}
						<Button
              onPress={ async () => {
                const imageUri = await ImageService.Camera()
                if (imageUri) {
                  setImageUri(imageUri)
                }
              }}
							title="Camera"
							type="solid"
						/>
            <Button
							onPress={async () => {
                const imageUri = await ImageService.Gallery() 
                if (imageUri) { 
                  setImageUri(imageUri)
                }
              }}
							title="Gallery"
							type="solid"
						/>
            <View style={{ marginVertical: 42 }}> 
                <Button color={colors.buttonPrimary} title="Submit Entry" onPress={handleSubmit} />
            </View>
      </View>
    </ScrollView>
  )
}


