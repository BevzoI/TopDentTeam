import React from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const SECTIONS = [
  { key: "omluvenky", label: "Omluvenky", icon: "emoticon-sick" },
  { key: "nastenka", label: "Nástěnka", icon: "clipboard-text" },
  { key: "zpravy", label: "Zprávy", icon: "message-text" },

  { key: "dotazniky", label: "Dotazníky", icon: "file-document-edit" },
  { key: "dovolena", label: "Dovolená", icon: "briefcase" },
  { key: "vyplatni", label: "Výplatní páska", icon: "file-document" },

  { key: "kurzy", label: "Kurzy", icon: "presentation-play" },
  { key: "kontakty", label: "Kontakty", icon: "account-multiple" },
  { key: "fotogalerie", label: "Fotogalerie", icon: "camera" },

  { key: "akce", label: "Akce", icon: "party-popper" },
  { key: "prihlaseni", label: "Přihlášení", icon: "login" },
];

export default function App() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile} onPress={() => console.log(item.key)}>
      <MaterialCommunityIcons name={item.icon} size={40} color="#000" />
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>TopDentTeam</Text>

        <TouchableOpacity style={styles.avatarWrapper}>
          {/* Можеш підставити свій аватар */}
          <Image
            source={{
              uri: "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* GRID */}
      <View style={styles.content}>
        <FlatList
          data={SECTIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      </View>
    </SafeAreaView>
  );
}

const TILE_SIZE = 100;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#1E88E5", // синій як у прикладі
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fff",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 8,
    backgroundColor: "#ffffff",
  },
  grid: {
    alignItems: "center",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 6,
    backgroundColor: "#BBDEFB", // світло-синій фон плитки
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "center",
    color: "#000",
    fontWeight: "500",
  },
});
