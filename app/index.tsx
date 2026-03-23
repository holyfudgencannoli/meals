// import { ScreenPrimative } from "@/components/screen-primative";
// import { Shades } from "@/config/LightTheme";
// import { colors } from "@/config/theme";
// import { useTheme } from "@/hooks/useTheme";
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { Button, Text, useTheme } from "@rneui/themed";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const [timestamps, setTimestamps] = useState<number[]>([]);


	const xyz = useCallback(async () => {
		const result = await notifee.getTriggerNotifications();
		// Get unique timestamps from scheduled notifications
		const uniqueTimestamps = Array.from(new Set(result.map(n => n.trigger.timestamp)));
		setTimestamps(uniqueTimestamps);
		return uniqueTimestamps;
	}, []);

	async function requestPermission() {
		await notifee.requestPermission();
	}

	const display = async () => {
		await notifee.displayNotification({
			title: 'Hello',
			body: 'This is a Notifee notification!',
		});
	};

	const trigger: (timestamp: number) => TimestampTrigger = (timestamp: number): TimestampTrigger => {
		return {
			type: TriggerType.TIMESTAMP,
			timestamp: timestamp,
		}
	}

	const breakfastNotify = async () => {
		// Calculate tomorrow's 8:00 AM timestamp
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);
		tomorrow.setHours(8, 0, 0, 0);
		const timestamp = tomorrow.getTime();
		const scheduledTimestamps = await xyz();
		if (scheduledTimestamps.includes(timestamp)) {
			console.log('Breakfast notification already scheduled for tomorrow');
			return;
		} else {
			console.log('Scheduling breakfast notification for tomorrow');
			await requestPermission();
			const channelId = await notifee.createChannel({
				id: 'default',
				name: 'Default Channel',
			});
			await notifee.createTriggerNotification({
				title: 'Breakfast Time!',
				body: "If you're having breakfast, log it in the app to keep track of your meals and nutrition.",
				android: {
					channelId,
				},
			}, trigger(timestamp));
			console.log('Notification scheduled for Breakfast Tomorrow');
		}
	}

	const lunchNotify = async () => {
		// Calculate tomorrow's 12:00 PM timestamp
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);
		tomorrow.setHours(12, 0, 0, 0);
		const timestamp = tomorrow.getTime();
		const scheduledTimestamps = await xyz();
		if (scheduledTimestamps.includes(timestamp)) {
			console.log('Lunch notification already scheduled for tomorrow');
			return;
		} else {
			console.log('Scheduling lunch notification for tomorrow');
			await requestPermission();
			const channelId = await notifee.createChannel({
				id: 'default',
				name: 'Default Channel',
			});
			await notifee.createTriggerNotification({
				title: 'Lunch Time!',
				body: "If you're having lunch, log it in the app to keep track of your meals and nutrition.",
				android: {
					channelId,
				},
			}, trigger(timestamp));
			console.log('Notification scheduled for Lunch Tomorrow');
		}
	}

	const dinnerNotify = async () => {
		// Calculate tomorrow's 6:00 PM timestamp
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(now.getDate() + 1);
		tomorrow.setHours(18, 0, 0, 0);
		const timestamp = tomorrow.getTime();
		const scheduledTimestamps = await xyz();
		if (scheduledTimestamps.includes(timestamp)) {
			console.log('Dinner notification already scheduled for tomorrow');
			return;
		} else {
			console.log('Scheduling dinner notification for tomorrow');
			await requestPermission();
			const channelId = await notifee.createChannel({
				id: 'default',
				name: 'Default Channel',
			});
			await notifee.createTriggerNotification({
				title: 'Dinner Time!',
				body: "If you're having dinner, log it in the app to keep track of your meals and nutrition.",
				android: {
					channelId,
				},
			}, trigger(timestamp));
			console.log('Notification scheduled for Dinner Tomorrow');
		}
	}

	useEffect(() => {
		xyz();
		setTimeout(() => {
			breakfastNotify();
			setTimeout(() => {
				lunchNotify();
				setTimeout(() => {
					dinnerNotify();
				}, 1000);
			}, 1000);
		}, 1000);
		
	}, [])

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
