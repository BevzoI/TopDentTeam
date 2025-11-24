import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { api, setToken } from "./src/api";

// Plošky na dashboardu
const SECTIONS = [
  { key: "requests", label: "Žádosti", icon: "file-document-edit" },
  { key: "nastenka", label: "Nástěnka", icon: "clipboard-text" },
  { key: "gallery", label: "Fotogalerie", icon: "camera" },
  { key: "contacts", label: "Kontakty", icon: "account-multiple" },
  { key: "courses", label: "Kurzy", icon: "presentation-play" },
  { key: "profile", label: "Profil", icon: "account" },
];

// Typy žádostí – musí odpovídat backend enumům
const TYPE_OPTIONS = [
  { key: "vacation", label: "Dovolená" },
  { key: "sick_leave", label: "Nemoc" },
  { key: "business_note", label: "Služební záznam" },
  { key: "schedule_change", label: "Změna směny" },
  { key: "other", label: "Jiné" },
];

const STATUS_LABELS = {
  pending: "Čeká na schválení",
  approved: "Schváleno",
  rejected: "Zamítnuto",
};

/////////////////////// LOGIN ///////////////////////

function LoginScreen({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Chyba", "Vyplňte prosím email i heslo.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);

      const res = await api.post("/auth/login", form);
      setToken(res.data.access_token);
      onLoggedIn();
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Přihlášení selhalo",
        "Nesprávný email nebo heslo, nebo uživatel neexistuje."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 24 }}>
        <Text style={styles.loginTitle}>Přihlášení</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Heslo"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Přihlásit se</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/////////////////////// HOME ///////////////////////

function HomeScreen({ onOpen }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => onOpen(item.key)}
    >
      <MaterialCommunityIcons name={item.icon} size={40} color="#000" />
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="menu" size={26} color="#fff" />
        <Text style={styles.headerTitle}>TopDentTeam</Text>
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </View>
      <View style={styles.content}>
        <FlatList
          data={SECTIONS}
          numColumns={3}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
        />
      </View>
    </SafeAreaView>
  );
}

/////////////////////// ŽÁDOSTI ///////////////////////

function RequestsScreen({ onBack }) {
  const [type, setType] = useState("vacation");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const loadRequests = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/requests/my");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Chyba", "Nepodařilo se načíst vaše žádosti.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const submit = async () => {
    if (!from || !to || !description.trim()) {
      Alert.alert("Chyba", "Vyplňte všechna pole (od, do, popis).");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/requests/", {
        type,
        date_from: from,
        date_to: to,
        description,
      });
      setFrom("");
      setTo("");
      setDescription("");
      Alert.alert("Hotovo", "Žádost byla odeslána.");
      loadRequests();
    } catch (err) {
      console.log(err);
      Alert.alert("Chyba", "Odeslání žádosti se nezdařilo.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestType}>
        {TYPE_OPTIONS.find((t) => t.key === item.type)?.label || item.type}
      </Text>
      <Text style={styles.requestDates}>
        {item.date_from} → {item.date_to}
      </Text>
      <Text style={styles.requestDescription}>{item.description}</Text>
      <Text style={styles.requestStatus}>
        Stav: {STATUS_LABELS[item.status] || item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Žádosti</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.sectionTitle}>Nová žádost</Text>
            <Text style={{ marginBottom: 4 }}>Typ žádosti:</Text>
            <View style={styles.chipRow}>
              {TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.chip,
                    type === opt.key && styles.chipActive,
                  ]}
                  onPress={() => setType(opt.key)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      type === opt.key && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Od (YYYY-MM-DD)"
              value={from}
              onChangeText={setFrom}
            />
            <TextInput
              style={styles.input}
              placeholder="Do (YYYY-MM-DD)"
              value={to}
              onChangeText={setTo}
            />
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholder="Popis / důvod"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={submit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Odeslat žádost</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Moje žádosti</Text>
          </View>
        }
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRequest}
        ListEmptyComponent={
          !loadingList && (
            <Text style={{ padding: 16 }}>Zatím nemáte žádné žádosti.</Text>
          )
        }
        ListFooterComponent={
          loadingList ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

/////////////////////// NÁSTĚNKA ///////////////////////

function NastenkaScreen({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts/");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Chyba", "Nepodařilo se načíst příspěvky.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nástěnka</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && <Text style={{ padding: 16 }}>Žádné příspěvky.</Text>
        }
      />
    </SafeAreaView>
  );
}

/////////////////////// PLACEHOLDER OBRAZOVKY ///////////////////////

function PlaceholderScreen({ title, onBack, text }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 30 }} />
      </View>
      <View style={{ padding: 16 }}>
        <Text>{text}</Text>
      </View>
    </SafeAreaView>
  );
}

/////////////////////// ROOT APP ///////////////////////

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState("home");

  if (!loggedIn) {
    return <LoginScreen onLoggedIn={() => setLoggedIn(true)} />;
  }

  if (screen === "requests") {
    return <RequestsScreen onBack={() => setScreen("home")} />;
  }

  if (screen === "nastenka") {
    return <NastenkaScreen onBack={() => setScreen("home")} />;
  }

  if (screen === "gallery") {
    return (
      <PlaceholderScreen
        title="Fotogalerie"
        onBack={() => setScreen("home")}
        text="Sekce fotogalerie bude doplněna později."
      />
    );
  }

  if (screen === "contacts") {
    return (
      <PlaceholderScreen
        title="Kontakty"
        onBack={() => setScreen("home")}
        text="Sekce kontaktů bude doplněna později."
      />
    );
  }

  if (screen === "courses") {
    return (
      <PlaceholderScreen
        title="Kurzy"
        onBack={() => setScreen("home")}
        text="Sekce kurzů bude doplněna později."
      />
    );
  }

  if (screen === "profile") {
    return (
      <PlaceholderScreen
        title="Profil"
        onBack={() => setScreen("home")}
        text="Sekce profilu bude doplněna později."
      />
    );
  }

  return <HomeScreen onOpen={setScreen} />;
}

/////////////////////// STYLES ///////////////////////

const TILE_SIZE = 110;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1E88E5",
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
  content: {
    flex: 1,
    padding: 8,
  },
  grid: {
    alignItems: "center",
    paddingVertical: 8,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 6,
    backgroundColor: "#BBDEFB",
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
  loginTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E88E5",
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#1E88E5",
  },
  chipText: {
    fontSize: 12,
    color: "#1E88E5",
  },
  chipTextActive: {
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  requestCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  requestType: {
    fontWeight: "600",
    marginBottom: 2,
  },
  requestDates: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  requestStatus: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#333",
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  postTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 4,
  },
  postDate: {
    fontSize: 11,
    color: "#777",
  },
});
