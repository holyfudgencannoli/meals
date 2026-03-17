import { Text, TouchableOpacity } from "react-native";

export default function Button({
    title,  
    onPress,
    color = '#8a8',
}: {
  title: string;
  onPress: () => void;
  color?: string;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={{ backgroundColor: color, padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
        </TouchableOpacity>
    )
}