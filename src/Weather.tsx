// @ts-ignore
import { API_KEY } from "@env";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  Platform,
  Button,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";

import { useStore } from "./store";

function LocationHeader({ city }: { city: string }) {
  return (
    <View style={{ paddingVertical: 20 }}>
      <Text style={{ fontSize: 30 }} numberOfLines={1} adjustsFontSizeToFit>
        {city}
      </Text>
    </View>
  );
}

function WeatherInfo({
  temperature,
  windSpeed,
  description,
  icon,
}: {
  temperature: number;
  windSpeed: number;
  description: string;
  icon: string;
}) {
  return (
    <View
      style={{
        flex: 3,
        flexDirection: "row",
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: 150,
            height: 150,
          }}
          source={{ uri: icon }}
        />
        <Text style={{ fontSize: 20 }}>{description}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 40 }} numberOfLines={1} adjustsFontSizeToFit>
          {temperature} °C
        </Text>
        <Text style={{ fontSize: 20 }}>{windSpeed} m/s</Text>
      </View>
    </View>
  );
}

type IWeather = {
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
  wind: {
    speed: number;
  };
  name: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<IWeather>();
  const [city, setCity] = useStore((state) => [state.city, state.setCity]);
  const [tempCity, setTempCity] = useState(city);
  const [coordinates, setCoordinates] = useState({ lat: 61.5, lon: 23.75 });

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&lang=fi&units=metric&APPID=${API_KEY}`,
    )
      .then((req) => req.json())
      .then((json) => {
        const weather = json as IWeather;
        setWeather(weather);
        setCity(weather.name);
      });
  }, [coordinates]);

  if (weather === undefined) {
    return <Text>Ladataan</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingHorizontal: 20,
        backgroundColor: "white",
      }}
    >
      <ExpoStatusBar style="auto" />
      <LocationHeader city={weather.name} />
      <WeatherInfo
        temperature={weather.main.temp}
        windSpeed={weather.wind.speed}
        description={weather.weather[0].description}
        icon={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            width: "100%",
          }}
        >
          <TextInput
            style={{
              height: 40,
              flexGrow: 1,
              borderWidth: 1,
              marginRight: 10,
              paddingHorizontal: 5,
            }}
            defaultValue={city}
            onChangeText={(text) => setTempCity(text)}
          />
          <TouchableOpacity
            style={{
              display: "flex",
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
            onPress={async () => {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    "Permission to access location was denied",
                    ToastAndroid.SHORT,
                  );
                }
                return;
              }

              const location = await Location.getCurrentPositionAsync({});
              setCoordinates({
                lat: location.coords.latitude,
                lon: location.coords.longitude,
              });
            }}
          >
            <Ionicons name="locate" size={24} />
          </TouchableOpacity>
        </View>
        <Button title="Päivitä" onPress={() => setCity(tempCity)} />
      </View>
    </View>
  );
}
