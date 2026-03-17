// import { AppThemeProvider } from '@/config/ThemeProvider';
import { migrateDbIfNeeded } from '@/db/migrations';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { setVisibilityAsync } from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = createTheme({
    lightColors: {
      primary: 'hsl(120, 70%, 40%)',
      background: 'hsl(120, 60%, 75%)',
      textPrimary: 'hsl(120, 70%, 20%)',
      textSecondary: 'hsl(120, 70%, 40%)',
      textShadowPrimary: 'rgba(0, 0, 0, 0.1)',
      textShadowSecondary: 'rgba(0, 0, 0, 0.05)',
      buttonPrimary: 'hsl(120, 70%, 80%)',
    },
    darkColors: {
      primary: 'hsl(120, 70%, 80%)',
      background: 'hsl(120, 60%, 20%)',
      textPrimary: 'hsl(120, 70%, 75%)',
      textSecondary: 'hsl(120, 70%, 80%)',
      textShadowPrimary: 'rgba(0, 0, 0, 0.5)',
      textShadowSecondary: 'rgba(0, 0, 0, 0.3)',
      buttonPrimary: 'hsl(120, 70%, 10%)',
    },
    mode: scheme === 'dark' ? 'dark' : 'light',
    components: {
      Button:(props,theme)=>({
        color: theme.colors.buttonPrimary,
        titleStyle:{ 
          fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary, textShadowColor: theme.colors.textShadowPrimary, textShadowOffset: { width: 2, height: 3 }, textShadowRadius: 2 
        },
        buttonStyle:{ 
          paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 
        }

      }),
      Text: (props, theme) => ({
        style: {
          color: theme.colors.textPrimary,
          textShadowColor: theme.colors.textShadowPrimary,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
      }),
    }
  })

  setVisibilityAsync('hidden')
  

    
	const handleInit = async (db: SQLiteDatabase) => {
    console.log("Initializing...")
		try {
			await migrateDbIfNeeded(db);
			console.log("✅ Migration complete!");
		} catch (err) {
			console.error("❌ Migration failed:", err);
		} 
  }

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider theme={theme}>
        <SQLiteProvider databaseName='food-journal.db' onInit={handleInit}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="new-entry" options={{ headerShown: false }} />
                <Stack.Screen name="view-all" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </SQLiteProvider>
    </ThemeProvider>
      </GestureHandlerRootView>
  );
}
