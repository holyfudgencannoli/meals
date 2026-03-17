// import { ScreenPrimative } from "@/components/screen-primative";
// import { Shades } from "@/config/LightTheme";
// import { colors } from "@/config/theme";
// import { useTheme } from "@/hooks/useTheme";
import { Button, Text, useTheme } from "@rneui/themed";
import { Link } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const window = useWindowDimensions()
    // const { dark, colors, fonts } = useTheme()
    // const shades = Shades
		const { theme } = useTheme()
		const colors = theme.colors
  

	return(
		// <ScreenPrimative edges={['top']}>
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				<Text
					style={{ 
						color: colors.primary, 
						fontSize: 44,
						fontWeight: 'bold',
						textShadowColor: colors.textShadowPrimary,
						textShadowOffset: { width: 2, height: 2 },
						textShadowRadius: 4,
						marginBottom: 16
					}}
				>
					Meals
				</Text>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 18,
						textShadowColor: colors.textShadowSecondary,
						textShadowOffset: { width: 1, height: 1 },
						textShadowRadius: 2,
						marginBottom: 32,
						textAlign: 'center',
						paddingHorizontal: 16
					}}
				>
					Recognize your intake
				</Text>
				<View style={{ 
					width: '100%', 
					height: 'auto', 
					margin: 42, 
					alignItems: 'center', 
				
					// backgroundColor: shades['color-neutral-400'], 
					padding: 16 
				}}> 
					{/* <Image source={require("../assets/images/android/res/mipmap-hdpi/ic_launcher_foreground.png")} */}
						{/* style={{ width: window.width/1.5, height: window.width/3  }} */}
					{/* /> */}
				</View>
				<View style={{ 
					// backgroundColor: shades['color-neutral-400'], 
					marginVertical: window.height/5, width: window.width, height: window.height/5, justifyContent: 'space-around', alignItems: 'center',  }}>
					<Link 
						href={'/new-entry'}
						asChild
					>
						<Button 
							onPress={() => console.log("Pressed!")}
							title="New Meal Entry"
							type="solid"
							
						/>
						{/* <TouchableOpacity>
							 <Text 
								style={{ 
								color: shades['color-neutral-100'], textShadowColor: shades['color-neutral-900'], textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, fontSize: 24, padding: 16 }}
							>
								New Meal Entry 
							</Text>
						</TouchableOpacity>*/}
					</Link> 
					<Link 
						href={'/view-all'}
						asChild
					>
						<Button 
							onPress={() => console.log("Pressed!")}
							title="View All Entries"
							type="solid"
						/>
					</Link>
					{/* <Link href={'/journal-entries'} asChild> 
						<TouchableOpacity>
							<Text 
							// style={{
								// color: shades['color-neutral-100'], textShadowColor: shades['color-neutral-900'], textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, fontSize: 24, padding: 16 }}
							>
								Journal Entries
							</Text>
						</TouchableOpacity>
					</Link>*/}
				</View>
			</SafeAreaView>
		// </ScreenPrimative>

	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: colors.background,
		alignItems: 'center',
		// padding: 16
		// justifyContent: 'center',
	},
	title: {
		// color: colors.primary,
		fontSize: 44,
		fontWeight: 'bold',
	}
});
