import { destroy, readAll } from '@/features/entries/services/entryService';
import { Entry } from '@/features/entries/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Text, useTheme } from '@rneui/themed';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Modal,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDate(value: string) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toLocaleString();
}

export default function ViewAllScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const db = useSQLiteContext();
	const isFocused = useIsFocused();
	const { theme } = useTheme();
	const colors = theme.colors;
	const { width } = useWindowDimensions();

	const [entries, setEntries] = useState<Entry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
	const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);

	const columnCount = width >= 900 ? 3 : 2;
	const gap = 16;
	const horizontalPadding = 24;
	const tileSize = Math.max(
		136,
		Math.floor((width - horizontalPadding * 2 - gap * (columnCount - 1)) / columnCount)
	);

	useEffect(() => {
		if (!isFocused) {
			return;
		}

		let isActive = true;

		async function loadEntries() {
			setIsLoading(true);

			try {
				const allEntries = await readAll(db);

				if (!isActive) {
					return;
				}

				setEntries(
					allEntries.filter((entry) => entry.image_uri?.trim().length > 0)
				);
			} catch (error) {
				console.error('Failed to load entry images', error);

				if (isActive) {
					setEntries([]);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		loadEntries();

		return () => {
			isActive = false;
		};
	}, [db, isFocused]);

	function promptDeleteEntry(entry: Entry) {
		if (deletingEntryId === entry.id) {
			return;
		}

		Alert.alert(
			'Delete photo?',
			`Remove "${entry.title}" from the gallery? This deletes the saved entry.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setDeletingEntryId(entry.id);

						try {
							await destroy(db, entry.id);
							setEntries((currentEntries) =>
								currentEntries.filter((currentEntry) => currentEntry.id !== entry.id)
							);

							setSelectedEntry((currentEntry) =>
								currentEntry?.id === entry.id ? null : currentEntry
							);
						} catch (error) {
							console.error('Failed to delete entry image', error);
							Alert.alert('Delete failed', 'Unable to delete this photo right now.');
						} finally {
							setDeletingEntryId((currentId) => (currentId === entry.id ? null : currentId));
						}
					},
				},
			]
		);
	}

	return (
		<SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
					<Ionicons name="arrow-back" size={32} color={colors.textPrimary} />
				</TouchableOpacity>
				<View style={styles.headerCopy}>
					<Text style={styles.title}>Meal Gallery</Text>
					<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
						{entries.length} saved {entries.length === 1 ? 'photo' : 'photos'}
					</Text>
					<Text style={[styles.helperText, { color: colors.textSecondary }]}>
						Tap to view. Long press to delete.
					</Text>
				</View>
			</View>

			{isLoading ? (
				<View style={styles.centerState}>
					<ActivityIndicator color={colors.primary} size="large" />
					<Text style={[styles.stateText, { color: colors.textSecondary }]}>Loading images...</Text>
				</View>
			) : entries.length === 0 ? (
				<View style={styles.centerState}>
					<Ionicons name="images-outline" size={56} color={colors.textSecondary} />
					<Text style={styles.emptyTitle}>No meal photos yet</Text>
					<Text style={[styles.stateText, { color: colors.textSecondary }]}>Add an entry with a photo and it will appear here.</Text>
					<View style={styles.emptyAction}>
						<Button title="Add Entry" onPress={() => router.push('/new-entry')} />
					</View>
				</View>
			) : (
				<FlatList
					key={columnCount}
					data={entries}
					numColumns={columnCount}
					keyExtractor={(item) => item.id.toString()}
					columnWrapperStyle={columnCount > 1 ? styles.row : undefined}
					contentContainerStyle={styles.galleryContent}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<TouchableOpacity
							activeOpacity={0.88}
							onPress={() => setSelectedEntry(item)}
								onLongPress={() => promptDeleteEntry(item)}
								disabled={deletingEntryId === item.id}
							style={[styles.tile, { width: tileSize, height: tileSize }]}
						>
							<Image source={{ uri: item.image_uri }} style={styles.tileImage} contentFit="cover" />
							<View style={styles.tileOverlay}>
								<Text numberOfLines={2} style={{ ...styles.tileTitle, color: colors.textSecondary, textShadowColor: colors.textShadowPrimary, textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 2 }}>
									{item.title}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			)}

			<Modal
				visible={selectedEntry !== null}
				animationType="fade"
				transparent
				statusBarTranslucent
				onRequestClose={() => setSelectedEntry(null)}
			>
				<View style={styles.modalBackdrop}>
					<SafeAreaView style={styles.modalSafeArea}>
						{selectedEntry ? (
							<View style={[styles.modalCard, { backgroundColor: colors.background }] }>
								<View style={styles.modalHeader}>
									<View style={styles.modalHeaderCopy}>
										<Text style={styles.modalTitle}>{selectedEntry.title}</Text>
										<Text style={[styles.modalDate, { color: colors.textSecondary }]}> 
											{formatDate(selectedEntry.created_at)}
										</Text>
									</View>
									<TouchableOpacity onPress={() => setSelectedEntry(null)} style={styles.iconButton}>
										<Ionicons name="close" size={28} color={colors.textPrimary} />
									</TouchableOpacity>
								</View>

								<Image
									source={{ uri: selectedEntry.image_uri }}
									style={styles.modalImage}
									contentFit="cover"
								/>

								<View style={styles.modalBody}>
									<Text style={[styles.modalBodyText, { color: colors.textSecondary }]}>
										{selectedEntry.body}
									</Text>
								</View>
							</View>
						) : null}
					</SafeAreaView>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	headerCopy: {
		flex: 1,
	},
	iconButton: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
	},
	subtitle: {
		fontSize: 15,
		marginTop: 4,
	},
	helperText: {
		fontSize: 13,
		marginTop: 6,
	},
	galleryContent: {
		paddingHorizontal: 24,
		paddingBottom: 32,
	},
	row: {
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	tile: {
		borderRadius: 18,
		overflow: 'hidden',
		backgroundColor: '#00000012',
	},
	tileImage: {
		width: '100%',
		height: '100%',
	},
	tileOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	tileTitle: {
		fontSize: 15,
		fontWeight: '700',
		textShadowColor: 'rgba(0, 0, 0, 0.35)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	centerState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 32,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8,
		textAlign: 'center',
	},
	stateText: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: 'center',
		marginTop: 12,
	},
	emptyAction: {
		marginTop: 24,
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.72)',
	},
	modalSafeArea: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	modalCard: {
		borderRadius: 24,
		overflow: 'hidden',
		maxHeight: '88%',
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 12,
	},
	modalHeaderCopy: {
		flex: 1,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: '700',
	},
	modalDate: {
		fontSize: 14,
		marginTop: 4,
	},
	modalImage: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#00000010',
	},
	modalBody: {
		paddingHorizontal: 18,
		paddingVertical: 18,
	},
	modalBodyText: {
		fontSize: 16,
		lineHeight: 24,
	},
});
